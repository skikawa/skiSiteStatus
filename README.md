English | [简体中文](./README.zh-CN.md)

<div align="center">
<h1>site-status</h1>
<p>An online status panel based on UptimeRobot API</p>
<br />
<img src="https://img.shields.io/github/last-commit/imsyy/site-status" alt="last commit"/>
<img src="https://img.shields.io/github/languages/code-size/imsyy/site-status" alt="code size"/>
<img src="https://img.shields.io/github/stars/imsyy/site-status?style=full" alt="GitHub stars"/>
<img src="https://img.shields.io/github/forks/imsyy/site-status?style=full&color=orange" alt="GitHub followers"/>
<br />
<br />
<img src="https://s1.ax1x.com/2023/07/20/pCHnLLt.png" alt="demo"/>
</div>

## 👀 Demo

> Demo password: `123456`

- [IMSYY-Site Monitoring](https://status.imsyy.top/)

## 🎉 Features

- 🌍 Multi-platform deployment support
- ✨ Elegant and smooth browsing experience
- 🔐 Supports site password encryption (JWT + Hash)
- 👀 Overall site status preview
- ⏲️ Data auto-refresh
- 📱 Mobile-friendly design

## Prerequisites

- You need to first add site monitors on [UptimeRobot](https://uptimerobot.com/dashboard) and get the `Read-Only API Key` from the `My Settings` or [API Management](https://dashboard.uptimerobot.com/integrations) page (Do not use the `Main API key`).
- You can also use `Monitor-specific API keys` for individual monitors.

## Deployment

### Recommended Setup

This project currently targets Cloudflare Workers and serves the frontend and API from the same deployment.

### Required Environment Variables

Set these secrets in Cloudflare Worker dashboard or via Wrangler secrets:

- `API_URL` = `https://api.uptimerobot.com/v3/`
- `API_KEY` = your UptimeRobot API key

Optional variables:

- `COUNT_DAYS` = `60` (default)
- `SHOW_LINKS` = `true` (default)

### Secure Secret Management

Do not store `API_KEY` in `wrangler.toml` or commit it to GitHub.
Use one of these commands:

```bash
npx wrangler secret put API_URL
npx wrangler secret put API_KEY
```

### Build and Deploy

```bash
npm install
npm run build
npm run deploy
```

### Troubleshooting

- If the app shows `Missing API_URL or API_KEY`, confirm that the secret exists in the Worker environment.
- If an API error persists, verify that `API_URL` is `https://api.uptimerobot.com/v3/` and `API_KEY` is valid.
- Make sure the Worker name in Dashboard matches the `name` in `wrangler.toml`.

## Local Development

Run the app locally with Vite:

```bash
npm install
npm run dev
```

### How it works

- Frontend fetches `/api/getMonitors` from the Worker.
- Worker reads `API_URL` and `API_KEY` from secrets and forwards requests to UptimeRobot.
- Cached responses are stored in memory for 60 seconds.

## UI Customization

Key UI settings are defined in:

- `src/theme/light.ts` — global theme, card radius, background colors
- `src/components/SiteCard.tsx` — card layout and padding
- `src/components/SiteCards.tsx` — card grid gap and spacing
- `src/styles/global.css` — base page styles

## Thanks

- [uptime-status](https://github.com/yb/uptime-status) inspired this project
