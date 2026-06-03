const i18n = {
  zh: {
    appTitle: "个人任务指挥台",
    languageToggle: "EN",
    languageState: "中文",
    beijingTime: "北京时间",
    nearestDdl: "最近 DDL",
    calculating: "计算中",
    expired: "已到期",
    remaining: (days, hours) => `剩 ${days} 天 ${hours} 小时`,
    todayOpen: "今日打开",
    unfinishedItems: "未完成事项",
    stockTheme: "股票主线",
    techRotation: "科技轮动",
    triggerOnly: "条件触发，不全天盯盘",
    trainingRate: "运动频率",
    trainingRateNote: "羽毛球一次，健身一次",
    tasks: "任务",
    archive: "归档",
    pomodoro: "番茄钟",
    bridge: "操作桥",
    remindersBot: "设置",
    todayMainline: "今日主线",
    priority: "优先级",
    timeBlocks: "时间块",
    oneSlotOneTask: "单时段单任务",
    resetChecks: "重置勾选",
    allTracks: "全部轨道",
    completedArchive: "归档",
    reports: "报告",
    weeklyReport: "周报",
    monthlyReport: "月报",
    generateWeekly: "生成周报",
    generateMonthly: "生成月报",
    autoSummaryRule: "周五 18:00 / 月末 20:00 自动总结",
    noReportsTitle: "暂无周报或月报",
    noReportsNote: "到时间会自动生成，也可以手动生成当前周期。",
    itemCount: count => `${count} 项`,
    focus: "专注",
    break: "休息",
    currentTask: title => `当前：${title}`,
    noCurrentTask: "当前：选择一个任务开始",
    start: "开始",
    pause: "暂停",
    reset: "重置",
    suggestion: "建议",
    weeklyPrinciples: "本周原则",
    executionRule: "执行口径",
    principlePaper: "论文占最好的连续时间。",
    principleMarket: "股票只在固定窗口与触发条件下处理。",
    principleCareer: "求职每周固定推进，不挤占论文主块。",
    principleBody: "运动是恢复，不加码成负担。",
    codexBridge: "Codex",
    rightDock: "右侧浮窗",
    openChat: "打开聊天窗",
    bridgeHint: "网页负责输入与过程查看；企业微信机器人负责把关键处理结果同步到手机。",
    reminders: "提醒",
    webSide: "网页端",
    enableNotify: "开启提醒",
    notifyHint: "所有带具体时间的任务默认提前 10 分钟提醒；网页保持打开时，浏览器提醒和声音可用。",
    weworkBot: "企业微信机器人",
    detecting: "检测中",
    configured: "已配置",
    notConfigured: "未配置",
    syncCodexResults: "同步 Codex 关键结果",
    sendTest: "发送测试",
    weworkHintOn: "推送收到、实时输出、最终结果和异常；细碎思考过程只留在网页。",
    weworkHintOff: "未检测到企业微信 webhook 配置，先在 .env 中配置 WEWORK_WEBHOOK_URL。",
    colors: "外观",
    theme: "主题",
    language: "语言",
    display: "显示",
    collapseRail: "收起侧边栏",
    expandRail: "展开侧边栏",
    resizeRail: "调节侧边栏宽度",
    messageCodex: "给 Codex 留言",
    collapse: "收起",
    inboxPlaceholder: "把任务、想法、提醒直接写在这里...",
    send: "发送",
    refresh: "刷新",
    noInbox: "暂无留言。这里写下来的内容会进 SQLite，Codex 处理时会显示流程。",
    processing: "处理中",
    done: "已完成",
    pending: "待处理",
    operationError: "操作异常",
    liveOutput: "实时输出",
    operationResult: "操作结果",
    codexProcessing: "Codex 正在处理，结果会自动显示在这里。",
    process: "处理过程",
    records: count => `${count} 条`,
    handled: "已处理",
    markHandled: "标记处理",
    manuallyMarked: "网页端手动标记为已处理。",
    received: "收到",
    thinking: "思考",
    command: "命令",
    output: "输出",
    result: "结果",
    error: "异常",
    startEvent: "开始",
    doneEvent: "完成",
    session: "会话",
    progress: "进度",
    reasoningDone: "完成一段推理。",
    commandDone: "完成一次命令执行。",
    processingShort: "处理中。",
    archiveBadge: value => `归档 ${value}`,
    emptyArchiveTitle: "暂无已完成归档",
    emptyArchiveNote: "勾选完成的任务会自动进入这里。",
    notificationUnsupported: "浏览器不支持系统通知",
    notificationFallback: "网页弹窗和声音提醒仍可用。",
    notificationEnabled: "提醒已开启",
    notificationDisabled: "未开启系统通知",
    notificationHint: "网页保持打开时，到点会提醒。",
    sentToInbox: "已发送到 Codex 收件箱",
    sentToInboxHint: "我后续会读取并处理。",
    weworkEnabled: "企业微信同步已开启",
    weworkDisabled: "企业微信同步已关闭",
    settingSaved: "设置已保存到本地数据库。",
    testSent: "测试消息已发送",
    testFailed: "测试消息发送失败",
    checkWeWork: "去企业微信里看一下机器人消息。",
    checkWebhook: "检查 webhook 配置或网络。",
    pageOverview: "总览",
    pageTasks: "任务",
    pageArchive: "归档",
    pageFocus: "专注",
    pageBridge: "Codex",
    pageSettings: "设置",
    titleOverview: "今日",
    titleTasks: "任务",
    titleArchive: "归档",
    titleFocus: "专注",
    titleBridge: "Codex",
    titleSettings: "设置",
    kickerOverview: "看板",
    kickerTasks: "追踪",
    kickerArchive: "完成",
    kickerFocus: "计时",
    kickerBridge: "对话",
    kickerSettings: "偏好",
    jumpTasksMeta: "任务",
    jumpArchiveMeta: "归档",
    jumpFocusMeta: "专注",
    jumpSettingsMeta: "设置",
    themeAir: "系统浅色",
    themePaper: "纸墨",
    themeTerminal: "终端绿",
    themeDeepsea: "金融深海",
    themeMorning: "晨间",
    themeSlate: "冷灰",
    trackAll: "全部",
    trackPaper: "论文",
    trackMarket: "股票",
    trackCareer: "求职",
    trackOps: "安全员",
    trackBody: "运动/生活",
    trackMeeting: "会议",
    timelineMarketOpen: "股票开盘检查，只看触发条件",
    timelineLightTask: "番茄钟：会前只做一个轻任务",
    timelineMeeting: "跟张欢开会",
    timelineDeepWork: "论文/工作深度块，单任务推进",
    timelineMarketClose: "午盘前检查，不延长",
    timelineAfternoon: "论文、求职材料或项目推进，三选一",
    timelineEvening: "轻任务：best paper、简历、复盘，三选一",
  },
  en: {
    appTitle: "Personal Task Deck",
    languageToggle: "中",
    languageState: "English",
    beijingTime: "Beijing Time",
    nearestDdl: "Nearest DDL",
    calculating: "Calculating",
    expired: "Expired",
    remaining: (days, hours) => `${days}d ${hours}h left`,
    todayOpen: "Open Today",
    unfinishedItems: "unfinished items",
    stockTheme: "Market Theme",
    techRotation: "Tech Rotation",
    triggerOnly: "Trigger-based, no all-day watching",
    trainingRate: "Training Rate",
    trainingRateNote: "Badminton once, gym once",
    tasks: "Tasks",
    archive: "Archive",
    pomodoro: "Pomodoro",
    bridge: "Bridge",
    remindersBot: "Settings",
    todayMainline: "Today's Mainline",
    priority: "Priority",
    timeBlocks: "Time Blocks",
    oneSlotOneTask: "One slot, one task",
    resetChecks: "Reset Checks",
    allTracks: "All Tracks",
    completedArchive: "Archive",
    reports: "Reports",
    weeklyReport: "Weekly",
    monthlyReport: "Monthly",
    generateWeekly: "Generate Weekly",
    generateMonthly: "Generate Monthly",
    autoSummaryRule: "Auto at Fri 18:00 / month-end 20:00",
    noReportsTitle: "No weekly or monthly reports",
    noReportsNote: "They are generated on schedule, or manually for the current period.",
    itemCount: count => `${count} items`,
    focus: "Focus",
    break: "Break",
    currentTask: title => `Current: ${title}`,
    noCurrentTask: "Current: choose a task to start",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    suggestion: "Suggestion",
    weeklyPrinciples: "Weekly Principles",
    executionRule: "Execution Rule",
    principlePaper: "Reserve the best continuous blocks for papers.",
    principleMarket: "Handle stocks only in fixed windows and trigger conditions.",
    principleCareer: "Move job search forward weekly without taking over paper blocks.",
    principleBody: "Exercise is recovery, not another burden.",
    codexBridge: "Codex Bridge",
    rightDock: "Right Dock",
    openChat: "Open Chat",
    bridgeHint: "Use the web UI for input and process details; WeWork mirrors key results to mobile.",
    reminders: "Reminders",
    webSide: "Web",
    enableNotify: "Enable Notifications",
    notifyHint: "Timed tasks remind 10 minutes early by default; browser alerts and sound work while the page stays open.",
    weworkBot: "WeWork Bot",
    detecting: "Checking",
    configured: "Configured",
    notConfigured: "Not configured",
    syncCodexResults: "Sync key Codex results",
    sendTest: "Send Test",
    weworkHintOn: "Pushes received, live output, final result, and errors; detailed process stays on the web.",
    weworkHintOff: "No WeWork webhook detected. Configure WEWORK_WEBHOOK_URL in .env first.",
    colors: "Appearance",
    theme: "Theme",
    language: "Language",
    display: "Display",
    collapseRail: "Collapse Sidebar",
    expandRail: "Expand Sidebar",
    resizeRail: "Resize Sidebar",
    messageCodex: "Message Codex",
    collapse: "Collapse",
    inboxPlaceholder: "Write tasks, ideas, reminders here...",
    send: "Send",
    refresh: "Refresh",
    noInbox: "No messages yet. Messages here are stored in SQLite and show Codex progress.",
    processing: "Processing",
    done: "Done",
    pending: "Pending",
    operationError: "Operation Error",
    liveOutput: "Live Output",
    operationResult: "Result",
    codexProcessing: "Codex is working. The result will appear here automatically.",
    process: "Process",
    records: count => `${count} records`,
    handled: "Handled",
    markHandled: "Mark Handled",
    manuallyMarked: "Marked as handled from the web UI.",
    received: "Received",
    thinking: "Thinking",
    command: "Command",
    output: "Output",
    result: "Result",
    error: "Error",
    startEvent: "Start",
    doneEvent: "Done",
    session: "Session",
    progress: "Progress",
    reasoningDone: "Finished a reasoning step.",
    commandDone: "Finished a command execution.",
    processingShort: "Processing.",
    archiveBadge: value => `Archived ${value}`,
    emptyArchiveTitle: "No completed archive",
    emptyArchiveNote: "Completed tasks will automatically move here.",
    notificationUnsupported: "Browser notifications are unsupported",
    notificationFallback: "Web toast and sound reminders still work.",
    notificationEnabled: "Notifications enabled",
    notificationDisabled: "Notifications not enabled",
    notificationHint: "Keep the page open to receive reminders.",
    sentToInbox: "Sent to Codex inbox",
    sentToInboxHint: "I will read and process it later.",
    weworkEnabled: "WeWork sync enabled",
    weworkDisabled: "WeWork sync disabled",
    settingSaved: "Setting saved to local database.",
    testSent: "Test message sent",
    testFailed: "Test message failed",
    checkWeWork: "Check the bot message in WeWork.",
    checkWebhook: "Check webhook config or network.",
    pageOverview: "Overview",
    pageTasks: "Tasks",
    pageArchive: "Archive",
    pageFocus: "Focus",
    pageBridge: "Codex",
    pageSettings: "Settings",
    titleOverview: "Today",
    titleTasks: "Tasks",
    titleArchive: "Archive",
    titleFocus: "Focus",
    titleBridge: "Codex",
    titleSettings: "Settings",
    kickerOverview: "Board",
    kickerTasks: "Track",
    kickerArchive: "Done",
    kickerFocus: "Timer",
    kickerBridge: "Chat",
    kickerSettings: "Prefs",
    jumpTasksMeta: "Tasks",
    jumpArchiveMeta: "Archive",
    jumpFocusMeta: "Focus",
    jumpSettingsMeta: "Setup",
    themeAir: "System Light",
    themePaper: "Paper",
    themeTerminal: "Terminal Green",
    themeDeepsea: "Deep Sea",
    themeMorning: "Morning",
    themeSlate: "Cool Gray",
    trackAll: "All",
    trackPaper: "Paper",
    trackMarket: "Market",
    trackCareer: "Career",
    trackOps: "Ops",
    trackBody: "Body/Life",
    trackMeeting: "Meeting",
    timelineMarketOpen: "Market open check, triggers only",
    timelineLightTask: "Pomodoro: one light task before the meeting",
    timelineMeeting: "Meeting with Zhang Huan",
    timelineDeepWork: "Paper/work deep block, single-task only",
    timelineMarketClose: "Pre-noon market check, do not extend",
    timelineAfternoon: "Choose one: paper, career material, or project work",
    timelineEvening: "Light task: best paper, resume, or review",
  },
};
const langKey = "task-deck-language-v1";
let currentLang = localStorage.getItem(langKey) || "zh";
if (!i18n[currentLang]) currentLang = "zh";
document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";

function t(key, ...args) {
  const value = i18n[currentLang][key] ?? i18n.zh[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

const themes = [
  { id: "air", labelKey: "themeAir", swatch: "#f5f6f8" },
  { id: "paper", labelKey: "themePaper", swatch: "#f4efe5" },
  { id: "terminal", labelKey: "themeTerminal", swatch: "#07130f" },
  { id: "deepsea", labelKey: "themeDeepsea", swatch: "#0b1220" },
  { id: "morning", labelKey: "themeMorning", swatch: "#fbf5ec" },
  { id: "slate", labelKey: "themeSlate", swatch: "#eef1f2" },
];
const themeKey = "task-deck-theme-v2";
let currentTheme = localStorage.getItem(themeKey) || "air";
document.body.dataset.theme = currentTheme;
const chatDockKey = "task-deck-chat-dock-open-v1";
const railWidthKey = "task-deck-rail-width-v1";
const railCollapsedKey = "task-deck-rail-collapsed-v1";
const railMinWidth = 216;
const railMaxWidth = 360;
const railCollapsedWidth = 72;

function clampRailWidth(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 272;
  return Math.min(railMaxWidth, Math.max(railMinWidth, numeric));
}

let railWidth = clampRailWidth(localStorage.getItem(railWidthKey) || 272);
let railCollapsed = localStorage.getItem(railCollapsedKey) === "1";


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
      showReminder({ title: t("notificationUnsupported"), body: t("notificationFallback") });
      return;
    }
    const permission = await Notification.requestPermission();
    showReminder({ title: permission === "granted" ? t("notificationEnabled") : t("notificationDisabled"), body: t("notificationHint") });
  });
}


let inboxMessages = [];
let reports = [];
let inboxFetchInFlight = false;
let inboxFetchQueued = false;
let inboxRefreshTimer = null;
let weworkStatus = { configured: false, bridge_enabled: true };

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
  if (event.event_type === "received") return { label: t("received"), kind: "received", content };
  if (event.event_type === "thinking") return { label: t("thinking"), kind: "thinking", content };
  if (event.event_type === "command") return { label: t("command"), kind: "command", content };
  if (event.event_type === "stream") return { label: t("output"), kind: "stream", content };
  if (event.event_type === "reply") return { label: t("result"), kind: "reply", content };
  if (event.event_type === "error") return { label: t("error"), kind: "error", content };
  if (content.includes("reasoning")) return { label: t("thinking"), kind: "thinking", content: t("reasoningDone") };
  if (content.includes("command_execution")) return { label: t("command"), kind: "command", content: t("commandDone") };
  if (content.includes("Codex 已开始")) return { label: t("startEvent"), kind: "start", content };
  if (content.includes("Codex 本轮处理完成")) return { label: t("doneEvent"), kind: "done", content };
  if (content.includes("Codex 会话")) return { label: t("session"), kind: "session", content };
  return { label: t("progress"), kind: "status", content };
}

function isTranscriptMessage(view) {
  return ["stream", "reply", "error"].includes(view.kind);
}

function compactProcessContent(content) {
  const text = String(content || "").replace(/\s+/g, " ").trim();
  if (!text) return t("processingShort");
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
    list.innerHTML = `<div class="inbox-item"><p>${escapeHtml(t("noInbox"))}</p></div>`;
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
      <div class="inbox-status ${msg.status}">${msg.status === 'processing' ? t("processing") : msg.status === 'done' ? t("done") : t("pending")}</div>
      <p class="inbox-question">${escapeHtml(msg.content)}</p>
      ${result ? `
        <div class="operation-result ${result.event_type === 'error' ? 'error' : ''}">
          <span>${result.event_type === 'error' ? t("operationError") : result.event_type === 'stream' ? t("liveOutput") : t("operationResult")}</span>
          <p>${escapeHtml(result.content)}</p>
        </div>
      ` : msg.status === 'processing' ? `
        <div class="operation-result pending">
          <span>${t("processing")}</span>
          <p>${escapeHtml(t("codexProcessing"))}</p>
        </div>
      ` : ''}
      <details class="codex-process" ${msg.status === 'processing' ? 'open' : ''}>
        <summary>
          <span>${t("process")}</span>
          <strong>${escapeHtml(t("records", events.length))}</strong>
        </summary>
        <div class="codex-transcript">
          ${events.slice(-24).map(renderProcessEvent).join('')}
        </div>
      </details>
      <div class="inbox-meta">
        <span>${msg.created_at}</span>
        <button class="inbox-done" data-inbox-done="${msg.id}" type="button">${msg.status === 'done' ? t("handled") : t("markHandled")}</button>
      </div>
    </article>
  `}).join('');
  if (shouldStickToBottom) list.scrollTop = list.scrollHeight;
  list.querySelectorAll('[data-inbox-done]').forEach(button => {
    button.addEventListener('click', async () => {
      await fetch(`/api/inbox/${encodeURIComponent(button.dataset.inboxDone)}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: 'done', event: t("manuallyMarked") }),
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
        showReminder({ title: t("sentToInbox"), body: t("sentToInboxHint") });
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

async function fetchWeWorkStatus() {
  try {
    const response = await fetch('/api/wework/status', { cache: 'no-store' });
    if (!response.ok) throw new Error('wework status unavailable');
    weworkStatus = await response.json();
  } catch (error) {
    weworkStatus = { configured: false, bridge_enabled: false };
  }
  renderWeWorkStatus();
}

async function fetchReports() {
  try {
    const response = await fetch('/api/reports', { cache: 'no-store' });
    if (!response.ok) throw new Error('reports unavailable');
    const data = await response.json();
    reports = data.reports || [];
  } catch (error) {
    reports = [];
  }
  renderReports();
}

async function generateReport(type) {
  const response = await fetch('/api/reports/generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ type }),
  });
  if (response.ok) {
    const data = await response.json();
    reports = data.reports || [];
    renderReports();
  }
}

function renderReport(report) {
  const typeLabel = report.report_type === 'monthly' ? t("monthlyReport") : t("weeklyReport");
  const summary = String(report.summary || "");
  const lines = summary.split(/\r?\n/).filter(line => line.trim().startsWith("- ")).slice(0, 5);
  return `
    <article class="report-card">
      <div class="report-head">
        <span>${escapeHtml(typeLabel)}</span>
        <strong>${escapeHtml(report.title)}</strong>
      </div>
      <p>${escapeHtml(report.range_label)}</p>
      <div class="report-summary">
        ${lines.length ? lines.map(line => `<span>${escapeHtml(line.replace(/^- /, ""))}</span>`).join("") : `<span>${escapeHtml(t("autoSummaryRule"))}</span>`}
      </div>
    </article>
  `;
}

function renderReports() {
  const list = document.querySelector("#reportList");
  const count = document.querySelector("#reportCount");
  if (count) count.textContent = t("itemCount", reports.length);
  if (!list) return;
  list.innerHTML = reports.length
    ? reports.map(renderReport).join("")
    : `<article class="report-card empty"><div class="report-head"><span>${escapeHtml(t("reports"))}</span><strong>${escapeHtml(t("noReportsTitle"))}</strong></div><p>${escapeHtml(t("noReportsNote"))}</p></article>`;
}

function bindReports() {
  document.querySelector("#generateWeeklyReport")?.addEventListener("click", () => generateReport("weekly"));
  document.querySelector("#generateMonthlyReport")?.addEventListener("click", () => generateReport("monthly"));
}

function renderWeWorkStatus() {
  const text = document.querySelector('#weworkStatusText');
  const toggle = document.querySelector('#weworkBridgeToggle');
  const test = document.querySelector('#testWeWork');
  const hint = document.querySelector('#weworkHint');
  if (text) text.textContent = weworkStatus.configured ? t("configured") : t("notConfigured");
  if (toggle) {
    toggle.checked = Boolean(weworkStatus.bridge_enabled);
    toggle.disabled = !weworkStatus.configured;
  }
  if (test) test.disabled = !weworkStatus.configured;
  if (hint) {
    hint.textContent = weworkStatus.configured
      ? t("weworkHintOn")
      : t("weworkHintOff");
  }
}

function bindWeWork() {
  document.querySelector('#weworkBridgeToggle')?.addEventListener('change', async event => {
    const enabled = event.target.checked;
    const response = await fetch('/api/wework/status', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ bridge_enabled: enabled }),
    });
    if (response.ok) {
      weworkStatus = await response.json();
      renderWeWorkStatus();
      showReminder({ title: enabled ? t("weworkEnabled") : t("weworkDisabled"), body: t("settingSaved") });
    }
  });

  document.querySelector('#testWeWork')?.addEventListener('click', async () => {
    const button = document.querySelector('#testWeWork');
    if (button) button.disabled = true;
    try {
      const response = await fetch('/api/wework/test', { method: 'POST' });
      showReminder({
        title: response.ok ? t("testSent") : t("testFailed"),
        body: response.ok ? t("checkWeWork") : t("checkWebhook"),
      });
    } finally {
      if (button) button.disabled = !weworkStatus.configured;
    }
  });
}

const tracks = [
  { id: "all", labelKey: "trackAll", short: "ALL" },
  { id: "paper", labelKey: "trackPaper", short: "PAPER" },
  { id: "market", labelKey: "trackMarket", short: "MKT" },
  { id: "career", labelKey: "trackCareer", short: "JOB" },
  { id: "ops", labelKey: "trackOps", short: "OPS" },
  { id: "body", labelKey: "trackBody", short: "LIFE" },
  { id: "meeting", labelKey: "trackMeeting", short: "MEET" },
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
  ["09:25", "timelineMarketOpen"],
  ["09:45", "timelineLightTask"],
  ["10:00", "timelineMeeting"],
  ["10:45", "timelineDeepWork"],
  ["11:20", "timelineMarketClose"],
  ["15:00", "timelineAfternoon"],
  ["20:30", "timelineEvening"],
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
  { id: "overview", labelKey: "pageOverview", short: "HOME", railIcon: "H", titleKey: "titleOverview", kickerKey: "kickerOverview" },
  { id: "tasks", labelKey: "pageTasks", short: "TASK", railIcon: "T", titleKey: "titleTasks", kickerKey: "kickerTasks" },
  { id: "archive", labelKey: "pageArchive", short: "ARC", railIcon: "A", titleKey: "titleArchive", kickerKey: "kickerArchive" },
  { id: "focus", labelKey: "pageFocus", short: "FOCUS", railIcon: "F", titleKey: "titleFocus", kickerKey: "kickerFocus" },
  { id: "bridge", labelKey: "pageBridge", short: "CODEX", railIcon: "C", titleKey: "titleBridge", kickerKey: "kickerBridge" },
  { id: "settings", labelKey: "pageSettings", short: "SETUP", railIcon: "S", titleKey: "titleSettings", kickerKey: "kickerSettings" },
];

const pageNav = document.querySelector("#pageNav");
const filterTabs = document.querySelector("#filterTabs");
const taskList = document.querySelector("#taskList");
const activeTrackLabel = document.querySelector("#activeTrackLabel");

function trackLabel(id) {
  const track = tracks.find(item => item.id === id);
  return track ? t(track.labelKey) : id;
}

function applyStaticText() {
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  document.title = t("appTitle");
  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });
  const button = document.querySelector("#languageToggle");
  if (button) {
    button.innerHTML = `<span>${t("languageToggle")}</span><strong>${t("languageState")}</strong>`;
    button.setAttribute("aria-label", currentLang === "zh" ? "Switch to English" : "切换到中文");
    button.title = currentLang === "zh" ? "Switch to English" : "切换到中文";
  }
}

function applyRailLayout() {
  const shell = document.querySelector(".shell");
  const rail = document.querySelector(".rail");
  const toggle = document.querySelector("#railToggle");
  const resizer = document.querySelector("#railResizer");
  if (!shell || !rail) return;

  const desktop = window.matchMedia("(min-width: 961px)").matches;
  const collapsed = desktop && railCollapsed;
  const width = collapsed ? railCollapsedWidth : railWidth;
  shell.style.setProperty("--rail-width", `${width}px`);
  rail.classList.toggle("collapsed", collapsed);

  if (toggle) {
    const label = collapsed ? t("expandRail") : t("collapseRail");
    toggle.textContent = collapsed ? "›" : "‹";
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
  }
  if (resizer) {
    resizer.setAttribute("aria-label", t("resizeRail"));
    resizer.title = t("resizeRail");
  }
}

function bindRailControls() {
  const toggle = document.querySelector("#railToggle");
  const resizer = document.querySelector("#railResizer");

  toggle?.addEventListener("click", () => {
    if (!window.matchMedia("(min-width: 961px)").matches) return;
    railCollapsed = !railCollapsed;
    localStorage.setItem(railCollapsedKey, railCollapsed ? "1" : "0");
    applyRailLayout();
  });

  resizer?.addEventListener("pointerdown", event => {
    if (!window.matchMedia("(min-width: 961px)").matches) return;
    event.preventDefault();
    railCollapsed = false;
    localStorage.setItem(railCollapsedKey, "0");
    document.body.classList.add("resizing-rail");
    resizer.setPointerCapture?.(event.pointerId);

    const move = moveEvent => {
      railWidth = clampRailWidth(moveEvent.clientX);
      localStorage.setItem(railWidthKey, String(railWidth));
      applyRailLayout();
    };

    const stop = () => {
      document.body.classList.remove("resizing-rail");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };

    move(event);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  });

  window.addEventListener("resize", applyRailLayout);
}


function renderThemes() {
  const pickers = [document.querySelector("#themePickerPanel")].filter(Boolean);
  if (!pickers.length) return;
  const html = themes.map(theme => `
    <button class="theme-swatch ${currentTheme === theme.id ? "active" : ""}" data-theme="${theme.id}" type="button" aria-label="${t(theme.labelKey)}" title="${t(theme.labelKey)}">
      <span style="--swatch:${theme.swatch}"></span>
    </button>
  `).join("");
  for (const picker of pickers) picker.innerHTML = html;
  document.querySelectorAll(".theme-swatch[data-theme]").forEach(button => {
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
  document.querySelector("#pageTitle").textContent = t(current.titleKey);
  document.querySelector("#pageKicker").textContent = t(current.kickerKey);
  document.body.dataset.page = activePage;

  pageNav.innerHTML = pages.map(page => {
    const count = page.id === "tasks"
      ? tasks.filter(task => !task.archived_at && !task.done).length
      : page.id === "archive"
        ? tasks.filter(task => task.archived_at).length
        : currentLang === "en" ? page.short : "";
    return `<button class="track-button ${activePage === page.id ? "active" : ""}" data-page-link="${page.id}" data-rail-icon="${page.railIcon}" type="button"><span>${t(page.labelKey)}</span>${count !== "" ? `<strong>${count}</strong>` : ""}</button>`;
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
  document.querySelectorAll(".overview-only").forEach(element => {
    element.hidden = activePage !== "overview";
  });
}

function renderTrackFilters() {
  if (!filterTabs) return;
  filterTabs.innerHTML = tracks.map(track => {
    const label = t(track.labelKey);
    return `<button class="${active === track.id ? "active" : ""}" data-track="${track.id}" title="${escapeHtml(label)}">${escapeHtml(label)}</button>`;
  }).join("");

  document.querySelectorAll("[data-track]").forEach(btn => {
    btn.addEventListener("click", () => {
      active = btn.dataset.track;
      render();
    });
  });
}

function taskCardHtml(task) {
  const isDone = Boolean(task.done);
  const isArchived = Boolean(task.archived_at);
  return `<article class="task-card ${isDone ? "done" : ""} ${isArchived ? "archived" : ""}" data-task-card="${task.id}">
    <button class="check" data-id="${task.id}" type="button" aria-label="切换完成状态">${isDone ? "✓" : ""}</button>
    <div>
      <p class="task-title">${escapeHtml(task.title)}</p>
      <div class="task-meta">
        <span class="badge">${trackLabel(task.track)}</span>
        <span class="badge">${escapeHtml(task.date)}</span>
        ${isArchived ? `<span class="badge">${escapeHtml(t("archiveBadge", task.archived_at))}</span>` : ""}
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
  const activeTasks = tasks.filter(t => !t.archived_at);
  const visible = active === "all" ? activeTasks : activeTasks.filter(t => t.track === active);
  activeTrackLabel.textContent = active === "all" ? t("allTracks") : trackLabel(active);
  taskList.innerHTML = visible.map(taskCardHtml).join("");
  bindTaskCards(taskList);
}

function renderArchive() {
  const archiveList = document.querySelector("#archiveList");
  const archiveCount = document.querySelector("#archiveCount");
  if (!archiveList) return;
  const archived = tasks
    .filter(task => task.archived_at)
    .sort((a, b) => String(b.archived_at).localeCompare(String(a.archived_at)));
  if (archiveCount) archiveCount.textContent = t("itemCount", archived.length);
  archiveList.innerHTML = archived.length
    ? archived.map(taskCardHtml).join("")
    : `<article class="task-card empty"><div><p class="task-title">${escapeHtml(t("emptyArchiveTitle"))}</p><div class="task-meta"><span>${escapeHtml(t("emptyArchiveNote"))}</span></div></div></article>`;
  bindTaskCards(archiveList);
  renderReports();
}

function renderOverview() {
  const overviewTasks = document.querySelector("#overviewTasks");
  if (overviewTasks) {
    const priorityTasks = tasks
      .filter(task => !task.done && !task.archived_at)
      .sort((a, b) => (a.p || "P2").localeCompare(b.p || "P2") || (a.sort_order || 999) - (b.sort_order || 999))
      .slice(0, 6);
    overviewTasks.innerHTML = priorityTasks.map(taskCardHtml).join("");
    bindTaskCards(overviewTasks);
  }
  const overviewTimeline = document.querySelector("#overviewTimeline");
  if (overviewTimeline) {
    overviewTimeline.innerHTML = timeline.map(([time, key]) => `
      <div class="time-row"><strong>${time}</strong><p>${t(key)}</p></div>
    `).join("");
  }
}

function renderStats() {
  const activeTasks = tasks.filter(t => !t.archived_at);
  const total = tasks.length;
  const doneCount = tasks.filter(t => t.archived_at).length;
  const open = activeTasks.filter(t => !t.done).length;
  document.querySelector("#openCount").textContent = String(open);
  document.querySelector("#doneRatio").textContent = total ? `${Math.round(doneCount / total * 100)}%` : "0%";
}

function renderTimeline() {
  document.querySelector("#timeline").innerHTML = timeline.map(([time, key]) => `
    <div class="time-row"><strong>${time}</strong><p>${t(key)}</p></div>
  `).join("");
}

function renderDeadline() {
  const target = new Date("2026-05-31T19:59:00+08:00");
  const diff = target - new Date();
  if (diff <= 0) {
    document.querySelector("#deadlineRemain").textContent = t("expired");
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  document.querySelector("#deadlineRemain").textContent = t("remaining", days, hours);
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
  mode.textContent = pomoMode === "focus" ? t("focus") : t("break");
  task.textContent = selected ? t("currentTask", selected.title) : t("noCurrentTask");
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

function bindLanguage() {
  document.querySelector("#languageToggle")?.addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    localStorage.setItem(langKey, currentLang);
    render();
    renderInbox();
    renderWeWorkStatus();
    renderReports();
  });
}

function render() {
  applyStaticText();
  applyRailLayout();
  renderThemes();
  renderPageNav();
  renderTrackFilters();
  renderOverview();
  renderTasks();
  renderArchive();
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
bindWeWork();
bindLanguage();
bindRailControls();
bindReports();
fetchInbox();
fetchWeWorkStatus();
fetchReports();
tickClock();
checkReminders();
renderPomodoro();
setInterval(tickClock, 15000);
setInterval(checkReminders, 30000);
setInterval(renderDeadline, 60000);
setInterval(fetchInbox, 5000);
setInterval(fetchReports, 15 * 60 * 1000);
