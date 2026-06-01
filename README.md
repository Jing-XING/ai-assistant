# Personal Task Dashboard

本项目是个人任务看板和 Codex 操作桥。

## 功能

- 多页任务看板：总览、任务、专注、Codex、设置。
- SQLite 静态存储任务、提醒、网页留言和处理事件。
- 带具体时间的任务默认提前 10 分钟提醒。
- 网页留言进入 `inbox` 后，服务端自动调用本机 `codex exec --json` 处理，把实时事件、错误和最终回复写入事件流，并通过 SSE 推送给网页。
- 自动桥会保存 Codex `thread_id`，后续网页留言使用 `codex exec resume` 续同一个网页专用会话。

## 启动

```bash
npm start
```

默认地址：

```text
http://127.0.0.1:8787/
```

## 环境变量

- `WEWORK_WEBHOOK_URL`：企业微信机器人 webhook，用于提醒。
- `CODEX_BIN`：Codex CLI 路径，默认 `codex`。
- `CODEX_AUTO_EXEC`：设为 `0` 可关闭网页留言自动执行。

`.env`、数据库、日志和 pid 文件不会提交到代码仓。
