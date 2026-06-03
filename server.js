const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { URL } = require('node:url');
const { DatabaseSync } = require('node:sqlite');

const PORT = Number(process.env.PORT || 8787);
const ROOT = __dirname;
const DB_PATH = path.join(ROOT, 'task_dashboard.db');
const PROGRESS_ROOT = path.resolve(ROOT, '..', 'progress');
const db = new DatabaseSync(DB_PATH);
const ENV_PATH = path.join(ROOT, '.env');

function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) return;
  const lines = fs.readFileSync(ENV_PATH, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    value = value.replace(/^['"]|['"]$/g, '');
    process.env[key] = process.env[key] || value;
  }
}

loadEnv();
const WEWORK_WEBHOOK_URL = process.env.WEWORK_WEBHOOK_URL || '';
const CODEX_BIN = process.env.CODEX_BIN || 'codex';
const CODEX_AUTO_EXEC = process.env.CODEX_AUTO_EXEC !== '0';
const runningInboxJobs = new Set();
const sseClients = new Set();
const bridgePushTypes = new Set(['received', 'stream', 'reply', 'error']);

const seedTasks = [
  ['cikm-entry', 'paper', 'P0', '再试 CIKM 2026 Short/Resource 注册入口', '2026-05-29', 'Short 摘要截止，北京时间', '2026-05-31 19:59', 0, 10],
  ['paper-normal', 'paper', 'P0', '继续推进正规论文', '本周', '集中连续时间写作，不碎片化', '', 0, 20],
  ['bestpaper', 'paper', 'P1', '收集 best paper 作为写作参考', '本周', '方法、实验、叙事结构', '', 0, 30],
  ['stock-tech', 'market', 'P0', '围绕科技主线板块做内部快速轮动', '近期', '只在固定窗口和触发条件下操作', '', 0, 40],
  ['stock-page', 'market', 'P1', '股票项目静态信息流页面', '5 月', '自选股、仓位、触发条件、新闻公告', '', 0, 50],
  ['parttime', 'career', 'P1', '确认上海兼职线索是否为算子相关岗位', '本周', '公司、薪酬、时间投入、远程/现场', '', 0, 60],
  ['quant-resume', 'career', 'P1', '量化方向简历改造', '近期', '突出 Python、ML、时序、股票 OHLC 项目', '', 0, 70],
  ['safety-friday', 'ops', 'P1', '周五下午安全检查前提前收拾', '每周五', '用电安全、个人卫生、空闲工位', '', 0, 80],
  ['safety-paper', 'ops', 'P2', '按月更新安全员纸质文件', '每月', '巡检、培训内容、安全活动', '', 0, 90],
  ['badminton', 'body', 'P2', '羽毛球 1 次', '每周', '恢复优先', '', 0, 100],
  ['gym', 'body', 'P2', '健身 1 次', '每周', '基础体能', '', 0, 110],
];

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      track TEXT NOT NULL,
      priority TEXT NOT NULL,
      title TEXT NOT NULL,
      task_date TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      due_at TEXT NOT NULL DEFAULT '',
      done INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      archived_at TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      remind_at TEXT NOT NULL,
      content TEXT NOT NULL,
      sent INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      sent_at TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS inbox (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      handled_at TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS bridge_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      inbox_id TEXT NOT NULL,
      event_type TEXT NOT NULL DEFAULT 'note',
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (inbox_id) REFERENCES inbox(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      report_type TEXT NOT NULL,
      period_key TEXT NOT NULL,
      title TEXT NOT NULL,
      range_label TEXT NOT NULL,
      summary TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(report_type, period_key)
    );
  `);
  const taskColumns = db.prepare('PRAGMA table_info(tasks)').all().map(column => column.name);
  if (!taskColumns.includes('archived_at')) {
    db.exec(`ALTER TABLE tasks ADD COLUMN archived_at TEXT NOT NULL DEFAULT ''`);
  }
  db.exec(`
    UPDATE tasks
    SET archived_at = COALESCE(NULLIF(updated_at, ''), CURRENT_TIMESTAMP)
    WHERE done = 1 AND archived_at = ''
  `);
  const count = db.prepare('SELECT COUNT(*) AS count FROM tasks').get().count;
  if (count === 0) {
    const insert = db.prepare(`
      INSERT INTO tasks (id, track, priority, title, task_date, note, due_at, done, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const row of seedTasks) insert.run(...row);
  }
}

initDb();

const mime = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.db', 'application/octet-stream'],
]);

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1_000_000) req.destroy();
    });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch (error) { reject(error); }
    });
    req.on('error', reject);
  });
}

function rows() {
  return db.prepare(`
    SELECT id, track, priority AS p, title, task_date AS date, note, due_at AS due, done, sort_order, archived_at
    FROM tasks
    ORDER BY sort_order ASC, created_at ASC
  `).all().map(row => ({ ...row, done: Boolean(row.done), archived: Boolean(row.archived_at) }));
}


function pad(value) {
  return String(value).padStart(2, '0');
}

function beijingParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    hour12: false,
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: map.weekday,
  };
}

function beijingDateString(date = new Date()) {
  const parts = beijingParts(date);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

function dateFromBeijing(year, month, day, hour = 0, minute = 0, second = 0) {
  return new Date(Date.UTC(year, month - 1, day, hour - 8, minute, second));
}

function formatBeijingDate(date) {
  return beijingDateString(date);
}

function lastDayOfMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function weekPeriod(date = new Date()) {
  const parts = beijingParts(date);
  const weekdayIndex = {
    周一: 1,
    周二: 2,
    周三: 3,
    周四: 4,
    周五: 5,
    周六: 6,
    周日: 7,
  }[parts.weekday] || 1;
  const mondayOffset = 1 - weekdayIndex;
  const start = dateFromBeijing(parts.year, parts.month, parts.day + mondayOffset);
  const end = dateFromBeijing(parts.year, parts.month, parts.day + mondayOffset + 6, 23, 59, 59);
  const periodKey = `${formatBeijingDate(start)}_${formatBeijingDate(end)}`;
  return {
    type: 'weekly',
    periodKey,
    title: `周报 ${formatBeijingDate(start)} - ${formatBeijingDate(end)}`,
    rangeLabel: `${formatBeijingDate(start)} 至 ${formatBeijingDate(end)}`,
    start,
    end,
    fileName: `${formatBeijingDate(start)}_${formatBeijingDate(end)}.md`,
    displayKey: periodKey,
  };
}

function monthPeriod(date = new Date()) {
  const parts = beijingParts(date);
  const start = dateFromBeijing(parts.year, parts.month, 1);
  const end = dateFromBeijing(parts.year, parts.month, lastDayOfMonth(parts.year, parts.month), 23, 59, 59);
  const periodKey = `${parts.year}-${pad(parts.month)}`;
  return {
    type: 'monthly',
    periodKey,
    title: `月报 ${periodKey}`,
    rangeLabel: `${formatBeijingDate(start)} 至 ${formatBeijingDate(end)}`,
    start,
    end,
    fileName: `${periodKey}.md`,
    displayKey: periodKey,
  };
}

function localIso(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00+08:00`;
}

function parseTaskTime(row) {
  const text = `${row.task_date || ''} ${row.due_at || ''} ${row.title || ''}`;
  let match = text.match(/(20\d{2})[-/年](\d{1,2})[-/月](\d{1,2})日?\s*(\d{1,2})[:：](\d{2})/);
  if (match) {
    const [, y, mo, d, h, mi] = match.map(String);
    return new Date(`${y}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(mi)}:00+08:00`);
  }
  match = text.match(/今天\s*(\d{1,2})[:：](\d{2})/);
  if (match) {
    const now = new Date();
    return new Date(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(match[1])}:${pad(match[2])}:00+08:00`);
  }
  return null;
}

function ensureReminderForTask(row) {
  if (row.done) return;
  const at = parseTaskTime(row);
  if (!at) return;
  const remind = new Date(at.getTime() - 10 * 60 * 1000);
  const reminderId = `${row.id}:minus10`;
  const content = `提醒：10 分钟后 ${row.title}`;
  db.prepare(`
    INSERT INTO reminders (id, task_id, remind_at, content)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      remind_at = excluded.remind_at,
      content = excluded.content
    WHERE sent = 0
  `).run(reminderId, row.id, localIso(remind), content);
}

function ensureAllReminders() {
  const all = db.prepare('SELECT * FROM tasks WHERE done = 0').all();
  for (const row of all) ensureReminderForTask(row);
}

function parseDbTime(value) {
  if (!value) return null;
  const normalized = String(value).replace(' ', 'T');
  const withZone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(normalized) ? normalized : `${normalized}+08:00`;
  const date = new Date(withZone);
  return Number.isNaN(date.getTime()) ? null : date;
}

function inPeriod(value, period) {
  const date = parseDbTime(value);
  return date && date >= period.start && date <= period.end;
}

function trackName(track) {
  return {
    paper: '论文',
    market: '股票',
    career: '求职',
    ops: '事务',
    body: '运动/生活',
    meeting: '会议',
  }[track] || track || '其他';
}

function summarizeReport(period) {
  const allTasks = rows();
  const completed = allTasks.filter(task => task.archived_at && inPeriod(task.archived_at, period));
  const open = allTasks.filter(task => !task.archived_at && !task.done);
  const byTrack = new Map();
  for (const task of completed) byTrack.set(task.track, (byTrack.get(task.track) || 0) + 1);
  const topOpen = open
    .sort((a, b) => (a.p || 'P2').localeCompare(b.p || 'P2') || (a.sort_order || 999) - (b.sort_order || 999))
    .slice(0, 6);

  const lines = [
    `# ${period.title}`,
    '',
    `时间范围：${period.rangeLabel}（北京时间）`,
    `生成时间：${localIso(new Date())}`,
    '',
    '## 完成概览',
    `- 完成任务：${completed.length} 项`,
    `- 未完成任务：${open.length} 项`,
  ];

  if (byTrack.size) {
    lines.push(`- 完成分布：${[...byTrack.entries()].map(([track, count]) => `${trackName(track)} ${count}`).join('；')}`);
  }

  lines.push('', '## 本期完成');
  if (completed.length) {
    for (const task of completed.slice(0, 12)) {
      lines.push(`- ${task.p}｜${trackName(task.track)}｜${task.title}`);
    }
    if (completed.length > 12) lines.push(`- 另有 ${completed.length - 12} 项已完成任务未展开。`);
  } else {
    lines.push('- 本期暂无已归档完成任务。');
  }

  lines.push('', '## 下期关注');
  if (topOpen.length) {
    for (const task of topOpen) {
      lines.push(`- ${task.p}｜${trackName(task.track)}｜${task.title}`);
    }
  } else {
    lines.push('- 暂无未完成任务。');
  }

  return lines.join('\n');
}

function writeReportFile(period, summary) {
  const folder = path.join(PROGRESS_ROOT, 'tracks', period.type === 'weekly' ? 'weekly' : 'monthly');
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, period.fileName), summary, 'utf8');
}

function ensureReport(period) {
  const existing = db.prepare('SELECT id FROM reports WHERE report_type = ? AND period_key = ?').get(period.type, period.periodKey);
  if (existing) return false;
  const summary = summarizeReport(period);
  const id = `${period.type}-${period.periodKey}`;
  db.prepare(`
    INSERT INTO reports (id, report_type, period_key, title, range_label, summary)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, period.type, period.periodKey, period.title, period.rangeLabel, summary);
  writeReportFile(period, summary);
  notifySse({ type: 'reports_updated', report_id: id });
  return true;
}

function reportRows() {
  return db.prepare(`
    SELECT id, report_type, period_key, title, range_label, summary, created_at
    FROM reports
    ORDER BY created_at DESC
    LIMIT 60
  `).all();
}

function scanReportJobs() {
  const now = new Date();
  const parts = beijingParts(now);
  if (parts.weekday === '周五' && parts.hour >= 18) ensureReport(weekPeriod(now));
  if (parts.day === lastDayOfMonth(parts.year, parts.month) && parts.hour >= 20) ensureReport(monthPeriod(now));
}

async function sendWeWork(content) {
  if (!WEWORK_WEBHOOK_URL) return false;
  const response = await fetch(WEWORK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ msgtype: 'text', text: { content } }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.errcode !== 0) throw new Error(`WeWork send failed: ${response.status} ${JSON.stringify(data)}`);
  return true;
}

function isWeWorkBridgeEnabled() {
  return getState('wework_bridge_enabled') !== '0';
}

function truncateText(text, length = 900) {
  const value = String(text || '').trim();
  return value.length > length ? `${value.slice(0, length)}...` : value;
}

function bridgePushTitle(eventType) {
  if (eventType === 'received') return '收到网页留言';
  if (eventType === 'stream') return 'Codex 中间结果';
  if (eventType === 'reply') return 'Codex 处理完成';
  if (eventType === 'error') return 'Codex 处理异常';
  return 'Codex 进度';
}

function inboxContent(id) {
  return db.prepare('SELECT content FROM inbox WHERE id = ?').get(id)?.content || '';
}

function mirrorBridgeEventToWeWork(inboxId, eventType, content) {
  if (!WEWORK_WEBHOOK_URL || !isWeWorkBridgeEnabled() || !bridgePushTypes.has(eventType)) return;
  const question = truncateText(inboxContent(inboxId), 220);
  const body = [
    `【${bridgePushTitle(eventType)}】`,
    question ? `问题：${question}` : '',
    `内容：${truncateText(content)}`,
  ].filter(Boolean).join('\n');
  sendWeWork(body).catch(error => {
    console.error(`[wework bridge] ${error.message}`);
  });
}

async function scanReminders() {
  ensureAllReminders();
  const now = localIso(new Date());
  const due = db.prepare(`SELECT * FROM reminders WHERE sent = 0 AND remind_at <= ? ORDER BY remind_at ASC LIMIT 10`).all(now);
  for (const reminder of due) {
    try {
      await sendWeWork(reminder.content);
      db.prepare(`UPDATE reminders SET sent = 1, sent_at = ? WHERE id = ?`).run(localIso(new Date()), reminder.id);
      console.log(`[reminder sent] ${reminder.content}`);
    } catch (error) {
      console.error(error.message);
    }
  }
}


function inboxRows() {
  const messages = db.prepare(`
    SELECT id, content, status, created_at, handled_at
    FROM inbox
    ORDER BY created_at DESC
    LIMIT 50
  `).all();
  const events = db.prepare(`
    SELECT id, inbox_id, event_type, content, created_at
    FROM bridge_events
    WHERE inbox_id = ?
    ORDER BY id ASC
  `);
  return messages.map(message => ({ ...message, events: events.all(message.id) }));
}

function addBridgeEvent(inboxId, eventType, content) {
  db.prepare(`
    INSERT INTO bridge_events (inbox_id, event_type, content)
    VALUES (?, ?, ?)
  `).run(inboxId, eventType, content);
  notifySse({ type: 'bridge_event', inbox_id: inboxId });
  mirrorBridgeEventToWeWork(inboxId, eventType, content);
}

function inboxExists(id) {
  return Boolean(db.prepare('SELECT id FROM inbox WHERE id = ?').get(id));
}

function setInboxStatus(id, status) {
  db.prepare(`
    UPDATE inbox
    SET status = ?, handled_at = CASE WHEN ? = 'done' THEN CURRENT_TIMESTAMP ELSE handled_at END
    WHERE id = ?
  `).run(status, status, id);
  notifySse({ type: 'inbox_status', inbox_id: id, status });
}

function getState(key) {
  return db.prepare('SELECT value FROM app_state WHERE key = ?').get(key)?.value || '';
}

function setState(key, value) {
  db.prepare(`
    INSERT INTO app_state (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `).run(key, value);
}

function notifySse(payload) {
  const body = `data: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try { client.write(body); }
    catch (error) { sseClients.delete(client); }
  }
}

function buildCodexPrompt(message) {
  return `你是用户个人任务网页的自动处理 Codex。

要求：
1. 用中文直接回复用户。
2. 如果是日程、任务、提醒、个人计划类问题，优先基于当前项目已有 SQLite/API/本地文件上下文回答。
3. 如果需要改代码或文件，只能在当前项目目录内做必要改动；不要删除用户数据，不要输出敏感 token、webhook、账号密码。
4. 如果信息不足，先给出可执行的下一步，不要长篇解释。
5. 最终回复控制在 300 字以内。

用户网页留言：
${message.content}`;
}

function runCodexForInbox(message) {
  if (!CODEX_AUTO_EXEC || runningInboxJobs.has(message.id)) return;
  runningInboxJobs.add(message.id);
  setInboxStatus(message.id, 'processing');
  addBridgeEvent(message.id, 'status', '已自动接入网页专用 Codex 会话，开始实时处理。');

  const outputFile = path.join('/tmp', `codex-bridge-${message.id}.txt`);
  const threadId = getState('codex_thread_id');
  const commonArgs = [
    '-s', 'workspace-write',
    '-a', 'never',
    '-C', ROOT,
    'exec',
  ];
  const args = threadId ? [
    ...commonArgs,
    'resume',
    threadId,
    '--skip-git-repo-check',
    '--json',
    '--output-last-message', outputFile,
    buildCodexPrompt(message),
  ] : [
    ...commonArgs,
    '--skip-git-repo-check',
    '--json',
    '--output-last-message', outputFile,
    buildCodexPrompt(message),
  ];

  const child = spawn(CODEX_BIN, args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
  let stdoutBuffer = '';
  let stderr = '';
  let finalReply = '';
  const killTimer = setTimeout(() => {
    addBridgeEvent(message.id, 'error', '自动执行超时，已停止本次 Codex 进程。');
    child.kill('SIGTERM');
  }, 180_000);

  function handleJsonLine(line) {
    if (!line.trim()) return;
    let event;
    try { event = JSON.parse(line); }
    catch (error) {
      addBridgeEvent(message.id, 'stream', line.slice(0, 1000));
      return;
    }

    if (event.type === 'thread.started' && event.thread_id) {
      setState('codex_thread_id', event.thread_id);
      addBridgeEvent(message.id, 'status', `已接入 Codex 会话：${event.thread_id}`);
      return;
    }

    if (event.type === 'turn.started') {
      addBridgeEvent(message.id, 'status', 'Codex 已开始生成回复。');
      return;
    }

    if (event.type === 'item.completed' && event.item) {
      if (event.item.type === 'agent_message' && event.item.text) {
        finalReply = event.item.text.trim();
        addBridgeEvent(message.id, 'stream', finalReply);
        return;
      }
      if (event.item.type === 'reasoning') {
        addBridgeEvent(message.id, 'thinking', '完成一段推理。');
        return;
      }
      if (event.item.type === 'command_execution') {
        addBridgeEvent(message.id, 'command', '完成一次命令执行。');
        return;
      }
      const label = event.item.type || 'item';
      addBridgeEvent(message.id, 'status', `Codex 完成步骤：${label}`);
      return;
    }

    if (event.type === 'turn.completed') {
      addBridgeEvent(message.id, 'status', 'Codex 本轮处理完成。');
    }
  }

  child.stdout.on('data', chunk => {
    stdoutBuffer += chunk.toString();
    const lines = stdoutBuffer.split(/\r?\n/);
    stdoutBuffer = lines.pop() || '';
    for (const line of lines) handleJsonLine(line);
  });

  child.stderr.on('data', chunk => {
    stderr += chunk.toString();
  });

  child.on('error', error => {
    runningInboxJobs.delete(message.id);
    clearTimeout(killTimer);
    addBridgeEvent(message.id, 'error', `自动执行启动失败：${error.message}`);
    setInboxStatus(message.id, 'done');
  });

  child.on('close', code => {
    runningInboxJobs.delete(message.id);
    clearTimeout(killTimer);
    if (stdoutBuffer.trim()) handleJsonLine(stdoutBuffer);

    let fileReply = '';
    if (fs.existsSync(outputFile)) {
      fileReply = fs.readFileSync(outputFile, 'utf8').trim();
      fs.rmSync(outputFile, { force: true });
    }

    if (code !== 0) {
      const detail = String(stderr || '').trim().split(/\r?\n/).slice(-3).join('\n');
      addBridgeEvent(message.id, 'error', `自动执行失败：${detail || 'Codex CLI 没有返回有效结果。'}`);
      setInboxStatus(message.id, 'done');
      return;
    }

    addBridgeEvent(message.id, 'reply', fileReply || finalReply || '已处理，但 Codex 没有返回文本。');
    setInboxStatus(message.id, 'done');
  });
}

function scanInboxJobs() {
  const pending = db.prepare(`
    SELECT id, content, status, created_at
    FROM inbox
    WHERE status = 'pending'
    ORDER BY created_at ASC
    LIMIT 3
  `).all();
  for (const message of pending) runCodexForInbox(message);
}

async function handleApi(req, res, url) {

  if (req.method === 'GET' && url.pathname === '/api/inbox/stream') {
    res.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-store',
      connection: 'keep-alive',
    });
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
    sseClients.add(res);
    res.on('close', () => sseClients.delete(res));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/inbox') {
    return json(res, 200, { messages: inboxRows() });
  }

  if (req.method === 'POST' && url.pathname === '/api/inbox') {
    const body = await readBody(req);
    const content = String(body.content || '').trim();
    if (!content) return json(res, 400, { error: 'content required' });
    const id = `inbox-${Date.now()}`;
    db.prepare('INSERT INTO inbox (id, content) VALUES (?, ?)').run(id, content);
    addBridgeEvent(id, 'received', '网页消息已进入 Codex 操作桥，等待处理。');
    setImmediate(scanInboxJobs);
    return json(res, 201, { messages: inboxRows() });
  }

  const inboxMatch = url.pathname.match(/^\/api\/inbox\/([^/]+)$/);
  if (req.method === 'PATCH' && inboxMatch) {
    const id = decodeURIComponent(inboxMatch[1]);
    if (!inboxExists(id)) return json(res, 404, { error: 'inbox message not found' });
    const body = await readBody(req);
    const allowedStatuses = new Set(['pending', 'processing', 'done']);
    const status = allowedStatuses.has(body.status) ? body.status : 'pending';
    db.prepare(`UPDATE inbox SET status = ?, handled_at = CASE WHEN ? = 'done' THEN CURRENT_TIMESTAMP ELSE '' END WHERE id = ?`).run(status, status, id);
    if (body.event) addBridgeEvent(id, 'status', String(body.event).trim());
    if (body.reply) addBridgeEvent(id, 'reply', String(body.reply).trim());
    return json(res, 200, { messages: inboxRows() });
  }

  const eventMatch = url.pathname.match(/^\/api\/inbox\/([^/]+)\/events$/);
  if (req.method === 'GET' && eventMatch) {
    const id = decodeURIComponent(eventMatch[1]);
    if (!inboxExists(id)) return json(res, 404, { error: 'inbox message not found' });
    const events = db.prepare(`
      SELECT id, inbox_id, event_type, content, created_at
      FROM bridge_events
      WHERE inbox_id = ?
      ORDER BY id ASC
    `).all(id);
    return json(res, 200, { events });
  }

  if (req.method === 'POST' && eventMatch) {
    const id = decodeURIComponent(eventMatch[1]);
    if (!inboxExists(id)) return json(res, 404, { error: 'inbox message not found' });
    const body = await readBody(req);
    const content = String(body.content || '').trim();
    if (!content) return json(res, 400, { error: 'content required' });
    const eventType = String(body.event_type || 'note').trim() || 'note';
    addBridgeEvent(id, eventType, content);
    return json(res, 200, { messages: inboxRows() });
  }

  if (req.method === 'GET' && url.pathname === '/api/wework/status') {
    return json(res, 200, {
      configured: Boolean(WEWORK_WEBHOOK_URL),
      bridge_enabled: isWeWorkBridgeEnabled(),
    });
  }

  if (req.method === 'PATCH' && url.pathname === '/api/wework/status') {
    const body = await readBody(req);
    const enabled = body.bridge_enabled ? '1' : '0';
    setState('wework_bridge_enabled', enabled);
    return json(res, 200, {
      configured: Boolean(WEWORK_WEBHOOK_URL),
      bridge_enabled: enabled === '1',
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/wework/test') {
    if (!WEWORK_WEBHOOK_URL) return json(res, 400, { error: 'wework webhook not configured' });
    await sendWeWork('企业微信机器人测试：任务看板已接通。');
    return json(res, 200, { ok: true });
  }

  if (req.method === 'GET' && url.pathname === '/api/tasks') {
    return json(res, 200, { tasks: rows() });
  }

  if (req.method === 'GET' && url.pathname === '/api/reports') {
    scanReportJobs();
    return json(res, 200, { reports: reportRows() });
  }

  if (req.method === 'POST' && url.pathname === '/api/reports/generate') {
    const body = await readBody(req);
    const type = body.type === 'monthly' ? 'monthly' : 'weekly';
    const period = type === 'monthly' ? monthPeriod(new Date()) : weekPeriod(new Date());
    ensureReport(period);
    return json(res, 200, { reports: reportRows() });
  }

  const taskMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)$/);
  if (req.method === 'PATCH' && taskMatch) {
    const id = decodeURIComponent(taskMatch[1]);
    const body = await readBody(req);
    const current = db.prepare('SELECT id FROM tasks WHERE id = ?').get(id);
    if (!current) return json(res, 404, { error: 'task not found' });

    const allowed = ['track', 'priority', 'title', 'task_date', 'note', 'due_at', 'done', 'sort_order', 'archived_at'];
    const updates = [];
    const values = [];
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        updates.push(`${key} = ?`);
        values.push(key === 'done' ? (body[key] ? 1 : 0) : body[key]);
      }
    }
    if (Object.prototype.hasOwnProperty.call(body, 'done') && !Object.prototype.hasOwnProperty.call(body, 'archived_at')) {
      updates.push('archived_at = ?');
      values.push(body.done ? localIso(new Date()) : '');
    }
    if (!updates.length) return json(res, 400, { error: 'no valid fields' });
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    ensureAllReminders();
    return json(res, 200, { tasks: rows() });
  }

  if (req.method === 'POST' && url.pathname === '/api/tasks') {
    const body = await readBody(req);
    const id = body.id || `task-${Date.now()}`;
    db.prepare(`
      INSERT INTO tasks (id, track, priority, title, task_date, note, due_at, done, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, body.track || 'paper', body.priority || 'P2', body.title || '新任务', body.task_date || '', body.note || '', body.due_at || '', body.done ? 1 : 0, body.sort_order || 999);
    ensureAllReminders();
    return json(res, 201, { tasks: rows() });
  }

  if (req.method === 'POST' && url.pathname === '/api/reset') {
    db.prepare(`UPDATE tasks SET done = 0, archived_at = '', updated_at = CURRENT_TIMESTAMP`).run();
    return json(res, 200, { tasks: rows() });
  }

  return json(res, 404, { error: 'api not found' });
}

function serveStatic(req, res, url) {
  const requested = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(ROOT, requested));
  if (!filePath.startsWith(ROOT) || filePath.endsWith('.db')) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      return res.end('Not found');
    }
    res.writeHead(200, {
      'content-type': mime.get(path.extname(filePath)) || 'application/octet-stream',
      'cache-control': 'no-cache',
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname.startsWith('/api/')) {
    handleApi(req, res, url).catch(error => {
      console.error(error);
      json(res, 500, { error: 'internal server error' });
    });
    return;
  }
  serveStatic(req, res, url);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Task dashboard running: http://127.0.0.1:${PORT}`);
  console.log(`SQLite database: ${DB_PATH}`);
  ensureAllReminders();
  scanReminders();
  scanReportJobs();
  scanInboxJobs();
  setInterval(scanReminders, 60_000);
  setInterval(scanReportJobs, 15 * 60_000);
  setInterval(scanInboxJobs, 5_000);
});
