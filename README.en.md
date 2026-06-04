# Personal Task Deck

[中文](README.md) | English

A personal task dashboard, reminder system, and Codex operation bridge. The app uses Beijing time by default and provides task tracking, time blocks, Pomodoro focus, archived reports, and a floating Codex chat dock. Local SQLite is used for static storage.

## Screenshots

| Overview | Tasks |
| --- | --- |
| ![Overview](assets/screenshots/overview.png) | ![Tasks](assets/screenshots/tasks.png) |

| Focus | Archive |
| --- | --- |
| ![Focus](assets/screenshots/focus.png) | ![Archive](assets/screenshots/archive.png) |

## Features

- Five main pages: Overview, Tasks, Archive, Focus, and Settings.
- Codex is available as a global floating chat dock instead of a dedicated sidebar page.
- SQLite stores tasks, reminders, web messages, Codex events, and weekly/monthly reports.
- Timed tasks remind 10 minutes early by default.
- WeWork bot integration can sync reminders, key Codex results, and errors.
- Web messages are stored in `inbox`; the server can call local `codex exec --json` automatically and stream live events back to the page through SSE.
- The bridge stores the Codex `thread_id`, then uses `codex exec resume` for later web messages in the same web-dedicated conversation.
- Three appearance themes are available: System Light, Deep Sea, and Cool Gray.

## Run

```bash
npm start
```

Default URL:

```text
http://127.0.0.1:8787/
```

Syntax check:

```bash
npm run check
```

## Environment Variables

- `WEWORK_WEBHOOK_URL`: WeWork bot webhook for reminders and result sync.
- `CODEX_BIN`: Codex CLI path. Defaults to `codex`.
- `CODEX_AUTO_EXEC`: Set to `0` to disable automatic execution for web messages.

`.env`, databases, logs, pid files, and `node_modules/` are excluded from git.
