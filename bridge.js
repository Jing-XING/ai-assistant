const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const DB_PATH = path.join(__dirname, 'task_dashboard.db');
const db = new DatabaseSync(DB_PATH);

function usage() {
  console.log(`Usage:
  node bridge.js list
  node bridge.js show <inbox_id>
  node bridge.js start <inbox_id> [note]
  node bridge.js event <inbox_id> <content>
  node bridge.js done <inbox_id> <reply>
  node bridge.js fail <inbox_id> <reason>`);
}

function ensureSchema() {
  db.exec(`
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
  `);
}

function exists(id) {
  return Boolean(db.prepare('SELECT id FROM inbox WHERE id = ?').get(id));
}

function addEvent(id, eventType, content) {
  if (!exists(id)) {
    console.error(`Inbox message not found: ${id}`);
    process.exit(1);
  }
  db.prepare(`
    INSERT INTO bridge_events (inbox_id, event_type, content)
    VALUES (?, ?, ?)
  `).run(id, eventType, content);
}

function setStatus(id, status) {
  db.prepare(`
    UPDATE inbox
    SET status = ?, handled_at = CASE WHEN ? IN ('done') THEN CURRENT_TIMESTAMP ELSE handled_at END
    WHERE id = ?
  `).run(status, status, id);
}

function list() {
  const rows = db.prepare(`
    SELECT id, status, content, created_at, handled_at
    FROM inbox
    ORDER BY created_at DESC
    LIMIT 30
  `).all();
  for (const row of rows) {
    console.log(`[${row.status}] ${row.id} ${row.created_at}`);
    console.log(`  ${row.content}`);
  }
}

function show(id) {
  const row = db.prepare('SELECT * FROM inbox WHERE id = ?').get(id);
  if (!row) {
    console.error(`Inbox message not found: ${id}`);
    process.exit(1);
  }
  console.log(`[${row.status}] ${row.id} ${row.created_at}`);
  console.log(row.content);
  const events = db.prepare(`
    SELECT event_type, content, created_at
    FROM bridge_events
    WHERE inbox_id = ?
    ORDER BY id ASC
  `).all(id);
  for (const event of events) {
    console.log(`- ${event.created_at} ${event.event_type}: ${event.content}`);
  }
}

ensureSchema();

const [command, id, ...rest] = process.argv.slice(2);
const text = rest.join(' ').trim();

if (command === 'list') {
  list();
} else if (command === 'show' && id) {
  show(id);
} else if (command === 'start' && id) {
  setStatus(id, 'processing');
  addEvent(id, 'status', text || 'Codex 已开始处理。');
  show(id);
} else if (command === 'event' && id && text) {
  addEvent(id, 'note', text);
  show(id);
} else if (command === 'done' && id && text) {
  addEvent(id, 'reply', text);
  setStatus(id, 'done');
  show(id);
} else if (command === 'fail' && id && text) {
  addEvent(id, 'error', text);
  setStatus(id, 'pending');
  show(id);
} else {
  usage();
  process.exit(1);
}
