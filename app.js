const themes = [
  { id: "paper", label: "纸墨" },
  { id: "terminal", label: "终端绿" },
  { id: "deepsea", label: "金融深海" },
  { id: "morning", label: "晨间" },
  { id: "slate", label: "冷灰" },
];
const themeKey = "task-deck-theme-v1";
let currentTheme = localStorage.getItem(themeKey) || "deepsea";
document.body.dataset.theme = currentTheme;
const chatDockKey = "task-deck-chat-dock-open-v1";


const reminders = [
  { id: "confidential-1350", at: "2026-06-01T13:50:00+08:00", title: "13:50 准备参加保密培训会议", body: "10 分钟后开始，先收一下当前任务。" },
  { id: "confidential-1400", at: "2026-06-01T14:00:00+08:00", title: "14:00 保密培训会议开始", body: "现在参加保密培训会议。" },
];
const firedReminderKey = "task-deck-fired-reminders-v1";
const firedReminders = new Set(JSON.parse(localStorage.getItem(firedReminderKey) || "[]"));

function saveFiredReminders() {
  localStorage.setItem(firedReminderKey, JSON.stringify([...firedReminders]));
}

function beep() {
  try {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 740;
    gain.gain.setValueAtTime(0.001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audio.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.45);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.5);
  } catch (error) {}
}

function showReminder(reminder) {
  const toast = document.querySelector("#reminderToast");
  if (toast) {
    toast.innerHTML = `<strong>${reminder.title}</strong><br><span>${reminder.body}</span>`;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 12000);
  }
  beep();
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(reminder.title, { body: reminder.body });
  }
}

function checkReminders() {
  const now = Date.now();
  for (const reminder of reminders) {
    const at = new Date(reminder.at).getTime();
    if (now >= at && now - at < 10 * 60 * 1000 && !firedReminders.has(reminder.id)) {
      firedReminders.add(reminder.id);
      saveFiredReminders();
      showReminder(reminder);
    }
  }
}

function bindNotifications() {
  document.querySelector("#enableNotify")?.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      showReminder({ title: "浏览器不支持系统通知", body: "网页弹窗和声音提醒仍可用。" });
      return;
    }
    const permission = await Notification.requestPermission();
    showReminder({ title: permission === "granted" ? "提醒已开启" : "未开启系统通知", body: "网页保持打开时，到点会提醒。" });
  });
}


let inboxMessages = [];
let inboxFetchInFlight = false;
let inboxFetchQueued = false;
let inboxRefreshTimer = null;

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
}

async function fetchInbox() {
  if (inboxFetchInFlight) {
    inboxFetchQueued = true;
    return;
  }
  inboxFetchInFlight = true;
  try {
    const response = await fetch('/api/inbox', { cache: 'no-store' });
    if (!response.ok) throw new Error('inbox unavailable');
    const data = await response.json();
    inboxMessages = data.messages;
  } catch (error) {
    inboxMessages = [];
  } finally {
    inboxFetchInFlight = false;
  }
  renderInbox();
  if (inboxFetchQueued) {
    inboxFetchQueued = false;
    scheduleInboxRefresh();
  }
}

function scheduleInboxRefresh() {
  clearTimeout(inboxRefreshTimer);
  inboxRefreshTimer = setTimeout(fetchInbox, 350);
}

function scrollInboxToBottom() {
  const list = document.querySelector('#inboxList');
  if (!list) return;
  requestAnimationFrame(() => {
    list.scrollTop = list.scrollHeight;
  });
}

function processEventView(event) {
  const content = String(event.content || "");
  if (event.event_type === "received") return { label: "收到", kind: "received", content };
  if (event.event_type === "thinking") return { label: "思考", kind: "thinking", content };
  if (event.event_type === "command") return { label: "命令", kind: "command", content };
  if (event.event_type === "stream") return { label: "输出", kind: "stream", content };
  if (event.event_type === "reply") return { label: "结果", kind: "reply", content };
  if (event.event_type === "error") return { label: "异常", kind: "error", content };
  if (content.includes("reasoning")) return { label: "思考", kind: "thinking", content: "完成一段推理。" };
  if (content.includes("command_execution")) return { label: "命令", kind: "command", content: "完成一次命令执行。" };
  if (content.includes("Codex 已开始")) return { label: "开始", kind: "start", content };
  if (content.includes("Codex 本轮处理完成")) return { label: "完成", kind: "done", content };
  if (content.includes("Codex 会话")) return { label: "会话", kind: "session", content };
  return { label: "进度", kind: "status", content };
}

function isTranscriptMessage(view) {
  return ["stream", "reply", "error"].includes(view.kind);
}

function compactProcessContent(content) {
  const text = String(content || "").replace(/\s+/g, " ").trim();
  if (!text) return "处理中。";
  return text.length > 150 ? `${text.slice(0, 150)}...` : text;
}

function renderProcessEvent(event) {
  const view = processEventView(event);
  const time = String(event.created_at || "").slice(11, 19) || "实时";
  if (isTranscriptMessage(view)) {
    return `
      <div class="codex-message ${escapeHtml(view.kind)}">
        <span>${escapeHtml(view.label)}</span>
        <p>${escapeHtml(view.content)}</p>
      </div>
    `;
  }
  return `
    <div class="codex-step-note ${escapeHtml(view.kind)}">
      <span>${escapeHtml(time)} · ${escapeHtml(view.label)}</span>
      <p>${escapeHtml(compactProcessContent(view.content))}</p>
    </div>
  `;
}

function renderInbox() {
  const list = document.querySelector('#inboxList');
  const count = document.querySelector('#chatDockCount');
  if (count) count.textContent = String(inboxMessages.filter(msg => msg.status !== 'done').length);
  if (!list) return;
  if (!inboxMessages.length) {
    list.innerHTML = '<div class="inbox-item"><p>暂无留言。这里写下来的内容会进 SQLite，Codex 处理时会显示流程。</p></div>';
    return;
  }
  const shouldStickToBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 96;
  const chatMessages = [...inboxMessages].reverse();
  list.innerHTML = chatMessages.map(msg => {
    const events = msg.events || [];
    const finalReply = [...events].reverse().find(event => event.event_type === 'reply');
    const finalError = [...events].reverse().find(event => event.event_type === 'error');
    const latestStream = [...events].reverse().find(event => event.event_type === 'stream');
    const result = finalReply || finalError || (msg.status === 'processing' ? latestStream : null);
    return `
    <article class="inbox-item ${msg.status === 'done' ? 'done' : ''}">
      <div class="inbox-status ${msg.status}">${msg.status === 'processing' ? '处理中' : msg.status === 'done' ? '已完成' : '待处理'}</div>
      <p class="inbox-question">${escapeHtml(msg.content)}</p>
      ${result ? `
        <div class="operation-result ${result.event_type === 'error' ? 'error' : ''}">
          <span>${result.event_type === 'error' ? '操作异常' : result.event_type === 'stream' ? '实时输出' : '操作结果'}</span>
          <p>${escapeHtml(result.content)}</p>
        </div>
      ` : msg.status === 'processing' ? `
        <div class="operation-result pending">
          <span>处理中</span>
          <p>Codex 正在处理，结果会自动显示在这里。</p>
        </div>
      ` : ''}
      <details class="codex-process" ${msg.status === 'processing' ? 'open' : ''}>
        <summary>
          <span>处理过程</span>
          <strong>${events.length} 条</strong>
        </summary>
        <div class="codex-transcript">
          ${events.slice(-24).map(renderProcessEvent).join('')}
        </div>
      </details>
      <div class="inbox-meta">
        <span>${msg.created_at}</span>
        <button class="inbox-done" data-inbox-done="${msg.id}" type="button">${msg.status === 'done' ? '已处理' : '标记处理'}</button>
      </div>
    </article>
  `}).join('');
  if (shouldStickToBottom) list.scrollTop = list.scrollHeight;
  list.querySelectorAll('[data-inbox-done]').forEach(button => {
    button.addEventListener('click', async () => {
      await fetch(`/api/inbox/${encodeURIComponent(button.dataset.inboxDone)}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: 'done', event: '网页端手动标记为已处理。' }),
      });
      fetchInbox();
    });
  });
}

function setChatDock(open) {
  const dock = document.querySelector('#chatDock');
  if (!dock) return;
  dock.classList.toggle('collapsed', !open);
  localStorage.setItem(chatDockKey, open ? '1' : '0');
  if (open) {
    setTimeout(() => {
      document.querySelector('#inboxInput')?.focus();
      scrollInboxToBottom();
    }, 80);
  }
}

function bindChatDock() {
  setChatDock(localStorage.getItem(chatDockKey) === '1');
  document.querySelector('#chatDockToggle')?.addEventListener('click', () => setChatDock(true));
  document.querySelector('#openChatDock')?.addEventListener('click', () => setChatDock(true));
  document.querySelector('#closeChatDock')?.addEventListener('click', () => setChatDock(false));
  document.addEventListener('pointerdown', event => {
    const dock = document.querySelector('#chatDock');
    if (!dock || dock.classList.contains('collapsed')) return;
    if (dock.contains(event.target)) return;
    if (event.target.closest('#openChatDock')) return;
    setChatDock(false);
  });
}

function bindInbox() {
  document.querySelector('#sendInbox')?.addEventListener('click', async () => {
    const input = document.querySelector('#inboxInput');
    const button = document.querySelector('#sendInbox');
    const content = input?.value.trim();
    if (!content || button?.disabled) return;
    if (button) button.disabled = true;
    try {
      const response = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (response.ok) {
        input.value = '';
        const data = await response.json();
        inboxMessages = data.messages;
        renderInbox();
        showReminder({ title: '已发送到 Codex 收件箱', body: '我后续会读取并处理。' });
      }
    } finally {
      if (button) button.disabled = false;
    }
  });
  document.querySelector('#refreshInbox')?.addEventListener('click', fetchInbox);
}

function bindInboxStream() {
  if (!("EventSource" in window)) return;
  const source = new EventSource('/api/inbox/stream');
  source.onmessage = () => scheduleInboxRefresh();
  source.onerror = () => {
    source.close();
    setTimeout(bindInboxStream, 5000);
  };
}

const tracks = [
  { id: "all", label: "全部", short: "ALL" },
  { id: "paper", label: "论文", short: "PAPER" },
  { id: "market", label: "股票", short: "MKT" },
  { id: "career", label: "求职", short: "JOB" },
  { id: "ops", label: "安全员", short: "OPS" },
  { id: "body", label: "运动/生活", short: "LIFE" },
  { id: "meeting", label: "会议", short: "MEET" },
];

const seedTasks = [
  { id: "one-slot-one-task", track: "ops", p: "P0", title: "每个时段只做一件事情", date: "每天", note: "一个时间块只允许一个主任务" },
  { id: "meeting-zhanghuan", track: "meeting", p: "P0", title: "10:00 跟张欢开会", date: "今天 10:00", note: "会议时段不并行处理股票/论文" },
  { id: "cikm-entry", track: "paper", p: "P0", title: "再试 CIKM 2026 Short/Resource 注册入口", date: "2026-05-29", due: "2026-05-31 19:59", note: "Short 摘要截止，北京时间" },
  { id: "paper-normal", track: "paper", p: "P0", title: "继续推进正规论文", date: "本周", note: "集中连续时间写作，不碎片化" },
  { id: "bestpaper", track: "paper", p: "P1", title: "收集 best paper 作为写作参考", date: "本周", note: "方法、实验、叙事结构" },
  { id: "stock-tech", track: "market", p: "P0", title: "围绕科技主线板块做内部快速轮动", date: "近期", note: "只在固定窗口和触发条件下操作" },
  { id: "stock-page", track: "market", p: "P1", title: "股票项目静态信息流页面", date: "5 月", note: "自选股、仓位、触发条件、新闻公告" },
  { id: "parttime", track: "career", p: "P1", title: "确认上海兼职线索是否为算子相关岗位", date: "本周", note: "公司、薪酬、时间投入、远程/现场" },
  { id: "quant-resume", track: "career", p: "P1", title: "量化方向简历改造", date: "近期", note: "突出 Python、ML、时序、股票 OHLC 项目" },
  { id: "safety-friday", track: "ops", p: "P1", title: "周五下午安全检查前提前收拾", date: "每周五", note: "用电安全、个人卫生、空闲工位" },
  { id: "safety-paper", track: "ops", p: "P2", title: "按月更新安全员纸质文件", date: "每月", note: "巡检、培训内容、安全活动" },
  { id: "badminton", track: "body", p: "P2", title: "羽毛球 1 次", date: "每周", note: "恢复优先" },
  { id: "gym", track: "body", p: "P2", title: "健身 1 次", date: "每周", note: "基础体能" },
];

let tasks = [...seedTasks];

const timeline = [
  ["09:25", "股票开盘检查，只看触发条件"],
  ["09:45", "番茄钟：会前只做一个轻任务"],
  ["10:00", "跟张欢开会"],
  ["10:45", "论文/工作深度块，单任务推进"],
  ["11:20", "午盘前检查，不延长"],
  ["15:00", "论文、求职材料或项目推进，三选一"],
  ["20:30", "轻任务：best paper、简历、复盘，三选一"],
];

let active = "all";
let apiOnline = false;
let pomoSeconds = 25 * 60;
let pomoMode = "focus";
let pomoRunning = false;
let pomoTimer = null;
let selectedTaskId = null;
let activePage = location.hash.replace("#", "") || "overview";

const pages = [
  { id: "overview", label: "总览", short: "HOME", title: "今日任务展示", kicker: "PERSONAL OPERATING BOARD" },
  { id: "tasks", label: "任务", short: "TASK", title: "任务流", kicker: "TRACKED WORK" },
  { id: "focus", label: "专注", short: "FOCUS", title: "番茄钟与时间块", kicker: "ONE SLOT ONE TASK" },
  { id: "bridge", label: "Codex", short: "CODEX", title: "Codex 操作桥", kicker: "MESSAGE AND PROCESS" },
  { id: "settings", label: "设置", short: "SETUP", title: "提醒与配色", kicker: "LOCAL CONTROL" },
];

const pageNav = document.querySelector("#pageNav");
const filterTabs = document.querySelector("#filterTabs");
const taskList = document.querySelector("#taskList");
const activeTrackLabel = document.querySelector("#activeTrackLabel");

function trackLabel(id) {
  return tracks.find(t => t.id === id)?.label || id;
}


function renderThemes() {
  const pickers = [document.querySelector("#themePicker"), document.querySelector("#themePickerPanel")].filter(Boolean);
  if (!pickers.length) return;
  const html = themes.map(theme => `<button class="theme-button ${currentTheme === theme.id ? "active" : ""}" data-theme="${theme.id}" type="button">${theme.label}</button>`).join("");
  for (const picker of pickers) picker.innerHTML = html;
  document.querySelectorAll("[data-theme]").forEach(button => {
    button.addEventListener("click", () => {
      currentTheme = button.dataset.theme;
      document.body.dataset.theme = currentTheme;
      localStorage.setItem(themeKey, currentTheme);
      renderThemes();
    });
  });
}

function renderPageNav() {
  if (!pages.some(page => page.id === activePage)) activePage = "overview";
  const current = pages.find(page => page.id === activePage);
  document.querySelector("#pageTitle").textContent = current.title;
  document.querySelector("#pageKicker").textContent = current.kicker;

  pageNav.innerHTML = pages.map(page => {
    const count = page.id === "tasks" ? tasks.filter(task => !task.done).length : page.short;
    return `<button class="track-button ${activePage === page.id ? "active" : ""}" data-page-link="${page.id}" type="button"><span>${page.label}</span><strong>${count}</strong></button>`;
  }).join("");

  document.querySelectorAll("[data-page-link]").forEach(button => {
    button.onclick = () => {
      activePage = button.dataset.pageLink;
      history.replaceState(null, "", `#${activePage}`);
      render();
    };
  });

  document.querySelectorAll("[data-page]").forEach(section => {
    section.classList.toggle("active", section.dataset.page === activePage);
  });
}

function renderTrackFilters() {
  if (!filterTabs) return;
  filterTabs.innerHTML = tracks.map(t => `<button class="${active === t.id ? "active" : ""}" data-track="${t.id}">${t.short}</button>`).join("");

  document.querySelectorAll("[data-track]").forEach(btn => {
    btn.addEventListener("click", () => {
      active = btn.dataset.track;
      render();
    });
  });
}

function taskCardHtml(task) {
  const isDone = Boolean(task.done);
  return `<article class="task-card ${isDone ? "done" : ""}" data-task-card="${task.id}">
    <button class="check" data-id="${task.id}" type="button" aria-label="切换完成状态">${isDone ? "✓" : ""}</button>
    <div>
      <p class="task-title">${escapeHtml(task.title)}</p>
      <div class="task-meta">
        <span class="badge">${trackLabel(task.track)}</span>
        <span class="badge">${escapeHtml(task.date)}</span>
        <span>${escapeHtml(task.note)}</span>
      </div>
    </div>
    <span class="priority ${task.p}">${task.p}</span>
  </article>`;
}

function bindTaskCards(root = document) {
  root.querySelectorAll("[data-task-card]").forEach(card => {
    card.addEventListener("click", event => {
      if (event.target.closest(".check")) return;
      selectedTaskId = card.dataset.taskCard;
      activePage = "focus";
      history.replaceState(null, "", "#focus");
      render();
    });
  });

  root.querySelectorAll(".check").forEach(btn => {
    btn.addEventListener("click", event => {
      event.stopPropagation();
      const id = btn.dataset.id;
      toggleDone(id);
    });
  });
}

function renderTasks() {
  const visible = active === "all" ? tasks : tasks.filter(t => t.track === active);
  activeTrackLabel.textContent = active === "all" ? "全部轨道" : trackLabel(active);
  taskList.innerHTML = visible.map(taskCardHtml).join("");
  bindTaskCards(taskList);
}

function renderOverview() {
  const overviewTasks = document.querySelector("#overviewTasks");
  if (overviewTasks) {
    const priorityTasks = tasks
      .filter(task => !task.done)
      .sort((a, b) => (a.p || "P2").localeCompare(b.p || "P2") || (a.sort_order || 999) - (b.sort_order || 999))
      .slice(0, 6);
    overviewTasks.innerHTML = priorityTasks.map(taskCardHtml).join("");
    bindTaskCards(overviewTasks);
  }
  const overviewTimeline = document.querySelector("#overviewTimeline");
  if (overviewTimeline) {
    overviewTimeline.innerHTML = timeline.map(([time, text]) => `
      <div class="time-row"><strong>${time}</strong><p>${text}</p></div>
    `).join("");
  }
}

function renderStats() {
  const total = tasks.length;
  const doneCount = tasks.filter(t => t.done).length;
  const open = total - doneCount;
  document.querySelector("#openCount").textContent = String(open);
  document.querySelector("#doneRatio").textContent = `${Math.round(doneCount / total * 100)}%`;
}

function renderTimeline() {
  document.querySelector("#timeline").innerHTML = timeline.map(([time, text]) => `
    <div class="time-row"><strong>${time}</strong><p>${text}</p></div>
  `).join("");
}

function renderDeadline() {
  const target = new Date("2026-05-31T19:59:00+08:00");
  const diff = target - new Date();
  if (diff <= 0) {
    document.querySelector("#deadlineRemain").textContent = "已到期";
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  document.querySelector("#deadlineRemain").textContent = `剩 ${days} 天 ${hours} 小时`;
}

function tickClock() {
  const now = new Date();
  document.querySelector("#clock").textContent = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
}


function formatPomo(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const rest = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

function renderPomodoro() {
  const time = document.querySelector("#pomoTime");
  const mode = document.querySelector("#pomoMode");
  const task = document.querySelector("#pomoTask");
  if (!time || !mode || !task) return;
  const selected = tasks.find(t => t.id === selectedTaskId);
  time.textContent = formatPomo(pomoSeconds);
  mode.textContent = pomoMode === "focus" ? "专注" : "休息";
  task.textContent = selected ? `当前：${selected.title}` : "当前：选择一个任务开始";
}

function startPomodoro() {
  if (pomoRunning) return;
  pomoRunning = true;
  pomoTimer = setInterval(() => {
    pomoSeconds -= 1;
    if (pomoSeconds <= 0) {
      pomoMode = pomoMode === "focus" ? "break" : "focus";
      pomoSeconds = pomoMode === "focus" ? 25 * 60 : 5 * 60;
    }
    renderPomodoro();
  }, 1000);
}

function pausePomodoro() {
  pomoRunning = false;
  clearInterval(pomoTimer);
}

function resetPomodoro() {
  pausePomodoro();
  pomoMode = "focus";
  pomoSeconds = 25 * 60;
  renderPomodoro();
  checkReminders();
}

function bindPomodoro() {
  document.querySelector("#pomoStart")?.addEventListener("click", startPomodoro);
  document.querySelector("#pomoPause")?.addEventListener("click", pausePomodoro);
  document.querySelector("#pomoReset")?.addEventListener("click", resetPomodoro);
}

function render() {
  renderThemes();
  renderPageNav();
  renderTrackFilters();
  renderOverview();
  renderTasks();
  renderStats();
  renderTimeline();
  renderDeadline();
  renderPomodoro();
}

async function fetchTasks() {
  try {
    const response = await fetch('/api/tasks', { cache: 'no-store' });
    if (!response.ok) throw new Error('api unavailable');
    const data = await response.json();
    tasks = data.tasks;
    apiOnline = true;
  } catch (error) {
    apiOnline = false;
    tasks = tasks.length ? tasks : [...seedTasks];
  }
}

async function toggleDone(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  const next = !task.done;
  task.done = next;
  render();

  if (!apiOnline) return;
  try {
    const response = await fetch(`/api/tasks/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ done: next }),
    });
    if (!response.ok) throw new Error('save failed');
    const data = await response.json();
    tasks = data.tasks;
    render();
  } catch (error) {
    task.done = !next;
    render();
  }
}

document.querySelector("#resetDone")?.addEventListener("click", async () => {
  tasks = tasks.map(t => ({ ...t, done: false }));
  render();
  if (!apiOnline) return;
  const response = await fetch('/api/reset', { method: 'POST' });
  if (response.ok) {
    const data = await response.json();
    tasks = data.tasks;
    render();
  }
});

window.addEventListener("hashchange", () => {
  activePage = location.hash.replace("#", "") || "overview";
  render();
});

fetchTasks().then(render);
bindPomodoro();
bindNotifications();
bindChatDock();
bindInbox();
bindInboxStream();
fetchInbox();
tickClock();
checkReminders();
renderPomodoro();
setInterval(tickClock, 15000);
setInterval(checkReminders, 30000);
setInterval(renderDeadline, 60000);
setInterval(fetchInbox, 5000);
