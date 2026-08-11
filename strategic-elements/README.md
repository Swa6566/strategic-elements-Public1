# Strategic Elements

A tracker for the critical minerals and rare earth supply chain. Watches five
Western and allied producers plus two sector funds, mapped to the elements they
actually produce.

React + Vite, deployed on Netlify. Market data from Finnhub, requested through a
Netlify Function so the API key stays server-side.

## Why the function matters

An earlier version of this project read the key from a `VITE_`-prefixed
variable. Vite inlines those into the JavaScript bundle at build time, which
means two things: the key is readable by anyone who opens DevTools, and
rotating it requires a full rebuild.

This version reads `FINNHUB_API_KEY` from `process.env` inside
`netlify/functions/`. The key never reaches the browser, and it can be changed
in the Netlify dashboard without rebuilding.

## Setup

```bash
npm install
npm run dev
```

For functions to work locally you need the Netlify CLI:

```bash
npm install -g netlify-cli
netlify dev
```

Copy `.env.example` to `.env` and add a free key from finnhub.io.

## Deploying

1. Push this folder to a GitHub repository.
2. In Netlify, create a site from that repository — not from Drop.
   Build command `npm run build`, publish directory `dist`.
3. Under Project configuration → Environment variables, add
   `FINNHUB_API_KEY`. No `VITE_` prefix.
4. Deploy.

If the key is missing the site still renders and says so plainly, rather than
failing silently.

## Data notes

Finnhub's free tier does not include historical candles, so the trend view uses
trailing return windows from `/stock/metric` (5D, 13W, 26W, 52W, YTD) instead of
a price chart. Responses are cached at the edge for 5 minutes (market) and 15
minutes (news) to stay inside the free-tier rate limit.
