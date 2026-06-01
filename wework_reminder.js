const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const envPath = path.join(root, '.env');

function loadEnv() {
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
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

const webhook = process.env.WEWORK_WEBHOOK_URL;
if (!webhook) {
  console.error('Missing WEWORK_WEBHOOK_URL in .env');
  process.exit(1);
}

async function send(content) {
  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      msgtype: 'text',
      text: { content },
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.errcode !== 0) {
    throw new Error(`WeWork send failed: ${response.status} ${JSON.stringify(data)}`);
  }
  return data;
}

function scheduleAt(iso, content) {
  const target = new Date(iso).getTime();
  const delay = target - Date.now();
  if (delay <= 0) {
    console.log(`[skip] ${iso} ${content}`);
    return;
  }
  console.log(`[scheduled] ${new Date(target).toLocaleString('zh-CN', { hour12: false })} ${content}`);
  setTimeout(async () => {
    try {
      await send(content);
      console.log(`[sent] ${content}`);
    } catch (error) {
      console.error(error.message);
    }
  }, delay);
}

async function main() {
  const mode = process.argv[2];
  if (mode === 'send') {
    const content = process.argv.slice(3).join(' ').trim();
    if (!content) throw new Error('Usage: node wework_reminder.js send <content>');
    await send(content);
    console.log('sent');
    return;
  }

  if (mode === 'confidential-training') {
    scheduleAt('2026-06-01T13:50:00+08:00', '提醒：10 分钟后参加保密培训会议，请先收一下当前任务。');
    scheduleAt('2026-06-01T14:00:00+08:00', '提醒：14:00 保密培训会议开始。');
    setInterval(() => {}, 60_000);
    return;
  }

  console.log('Usage: node wework_reminder.js send <content> | confidential-training');
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
