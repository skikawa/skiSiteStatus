English | [简体中文](./README.zh-CN.md)

<div align="center">
<h1>site-status</h1>
<p>An online status panel based on UptimeRobot API</p>
</div>


## Features

- SPEED UP
- Update UptimeRobotAPI to V3 & Refactoring with React 19 + Vite 8 + MUI 9
- Loading time from 60s → 10s
- UI Rewrite
- Rewrite with MUI & Generally follows Material Design
  
## Prerequisites

- You need to first add site monitors on [UptimeRobot](https://uptimerobot.com/dashboard) and get the `Read-Only API Key` from the `My Settings` or [API Management](https://dashboard.uptimerobot.com/integrations) page (Do not use the `Main API key`).
- You can also use `Monitor-specific API keys` for individual monitors.

## Deployment

### Recommended Setup

This project currently targets Cloudflare Workers.

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

## Local Development

Run the app locally with Vite:

```bash
npm install
npm run dev
```

## UI Customization

Key UI settings are defined in:

- `src/theme/light.ts` — global theme, card radius, background colors
- `src/components/SiteCard.tsx` — card layout and padding
- `src/components/SiteCards.tsx` — card grid gap and spacing
- `src/styles/global.css` — base page styles

## Thanks

- [site-status](https://github.com/imsyy/site-status) this project is a modified edition of it
- [uptime-status](https://github.com/yb/uptime-status) inspired this project
