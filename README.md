# Strategic Elements — Critical Minerals & Rare Earth Tracker

A research dashboard tracking the companies building a Western alternative to
China's grip on critical minerals and rare-earth processing.

## What's new in this version

- **4 new tickers**: USA Rare Earth (USAR), NioCorp Developments (NB),
  Critical Metals Corp (CRML), Ramaco Resources (METC) — alongside the
  existing MP Materials, Lynas, Energy Fuels, Albemarle, Lithium Americas,
  and the REMX / SETM benchmarks.
- **Pulse strip**: one card per company fusing price, a real trailing-return
  trend line, and the most relevant headline — instead of price, chart, and
  news living in separate sections.
- **Portfolio simulator**: allocate a hypothetical amount across the basket
  and see what it would be worth today, based on each company's real
  trailing return (no fabricated price history).
- **Sector chart with benchmarks**: ranked return bars per company with
  REMX/SETM marked as reference lines.
- **Cute/interactive touches**: element badges glow warm (terracotta) on up
  days and cool (violet) on down days and reveal a one-line fact on
  hover/focus; a Daylight/Ore theme toggle; a "today's mover" ribbon; a
  Critical Minerals IQ mini quiz.
- **News, sharper**: ticker filter chips, sentiment dots, and a dedicated
  Policy & Trade lane for the headlines that actually move this sector.

## Stack

React + Vite, Recharts for charts, Finnhub (`/quote` + `/stock/metric` —
both free-tier) for prices and returns, FreeNewsApi.io for sector news.

Note: Finnhub moved historical candles behind a paid tier, so this build
intentionally does not show literal price-chart sparklines. The "trend"
visuals are built from real trailing-return windows (1M/3M/6M/YTD/1Y)
instead — accurate, just not a continuous price line.

## Local setup

```bash
npm install
cp .env.example .env.local   # then fill in your real keys
npm run dev
```

## Deploying

This repo is already connected to Netlify, with `VITE_FINNHUB_API_KEY` and
`VITE_FREENEWS_API_KEY` set in Netlify's environment variables. To deploy
an update:

1. Push this source to `github.com/Swa6566/strategic-elements`
   (replace the repo contents, don't drag a built `dist` folder — Netlify
   needs to run `npm run build` itself so your env vars get baked in).
2. Netlify rebuilds automatically from the connected repo.

If you ever see a "missing API key" banner on the live site after a
deploy, it almost always means a `dist` folder was dragged onto Netlify
directly instead of going through a Git-connected build.
