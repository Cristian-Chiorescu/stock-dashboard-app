import type { Handler, HandlerEvent } from "@netlify/functions";

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
async function fetchJson(url: string, init?: RequestInit, attempts = 2): Promise<any> {
  let lastErr: any;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' }, cache: 'no-store', ...init });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
      }
      return await res.json();
    } catch (err) {
      lastErr = err;
      await sleep(150 + Math.random() * 150);
    }
  }
  throw lastErr;
}
function isSuspectQuote(q: any) {
  const c = q?.c, d = q?.d, dp = q?.dp;
  if (typeof c !== 'number' || !isFinite(c) || c === 0) return true;
  if ((d == null) && (dp == null)) return true;
  return false;
}

export const handler: Handler = async (event: HandlerEvent) => {
  const symbol = (event.queryStringParameters?.symbol || '').trim().toUpperCase();
  if (!symbol) {
    return { statusCode: 400, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ error: "Stock symbol is required" }) };
  }

  const API_KEY = process.env.FINNHUB_API_KEY;
  if (!API_KEY) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ error: "API key is not configured on the server." }) };
  }

  try {
    const base = 'https://finnhub.io/api/v1';
    const nowSec = Math.floor(Date.now() / 1000);
    const yearAgoSec = nowSec - 60 * 60 * 24 * 365;
    const cb = Date.now();

    const profileUrl = `${base}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${API_KEY}&cb=${cb}`;
    const quoteUrl   = `${base}/quote?symbol=${encodeURIComponent(symbol)}&token=${API_KEY}&cb=${cb}`;
    const dailyUrl   = `${base}/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=D&from=${yearAgoSec}&to=${nowSec}&token=${API_KEY}&cb=${cb}`;

    // Profile
    const profile = await fetchJson(profileUrl);
    if (!profile?.name) {
      return { statusCode: 404, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
        body: JSON.stringify({ error: `Stock symbol '${symbol}' not found.` }) };
    }

    // Quote with retry
    let quote = await fetchJson(quoteUrl);
    if (isSuspectQuote(quote)) {
      await sleep(200 + Math.random() * 200);
      quote = await fetchJson(quoteUrl);
    }
    if (isSuspectQuote(quote)) {
      quote = { ...quote, c: quote?.pc ?? 0, d: quote?.d ?? 0, dp: quote?.dp ?? 0 };
    }

    // Try daily candles (guarded). If forbidden or any failure, just skip.
    let daily: Array<{t:number;o:number;h:number;l:number;c:number;v?:number}> = [];
    let week52High = 0, week52Low = 0, volumeToday = 0;

    try {
      const candles = await fetchJson(dailyUrl);
      daily = (candles?.s === 'ok' && Array.isArray(candles?.t))
        ? candles.t.map((t: number, i: number) => ({
            t: t * 1000,
            o: candles.o[i],
            h: candles.h[i],
            l: candles.l[i],
            c: candles.c[i],
            v: candles.v?.[i],
          }))
        : [];

      if (daily.length > 0) {
        week52High = daily.reduce((m, d) => Math.max(m, Number(d.h) || 0), -Infinity);
        week52Low  = daily.reduce((m, d) => Math.min(m, Number(d.l) || Infinity), Infinity);
        const last = daily[daily.length - 1];
        volumeToday = Number(last?.v) || 0;
        if (!isFinite(week52High)) week52High = 0;
        if (!isFinite(week52Low)) week52Low = 0;
      }
    } catch (candlesErr: any) {
      // If the plan blocks candles, or we hit 403/limits, proceed without them.
      // You can inspect candlesErr.message if you want to log it.
      daily = [];
      week52High = 0;
      week52Low = 0;
      volumeToday = 0;
    }

    const combined = {
      name: profile.name,
      symbol: profile.ticker || symbol,
      quote: {
        price: quote.c,
        change: quote.d,
        percentChange: quote.dp,
        prevClose: quote.pc ?? null,
        high: quote.h ?? null,
        low: quote.l ?? null,
        open: quote.o ?? null,
      },
      stats: {
        marketCap: (profile.marketCapitalization ?? 0) * 1e6,
        peRatio: 0,                  // can fill later from another endpoint/provider
        week52High,
        week52Low,
        volume: volumeToday,
      },
      daily,                         // may be [], that's okay
      _meta: { ts: Date.now() }
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify(combined),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ error: error?.message || String(error) }),
    };
  }
};



