import type { Handler, HandlerEvent } from "@netlify/functions";

const MAX_DAILY = Number(process.env.MAX_DAILY_POINTS ?? "400");

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

async function fetchJson(url: string, init?: RequestInit, attempts = 2): Promise<any> {
  let lastErr: any;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: { "Accept": "application/json" }, cache: "no-store", ...init });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
      }
      const json = await res.json();
      // Alpha Vantage returns 200 with rate-limit notes
      if (json?.Note) throw new Error(`AlphaVantage limit: ${json.Note}`);
      if (json?.["Error Message"]) throw new Error(`AlphaVantage error: ${json["Error Message"]}`);
      return json;
    } catch (err) {
      lastErr = err;
      await sleep(150 + Math.random() * 150);
    }
  }
  throw lastErr;
}

async function fetchText(url: string, attempts = 2): Promise<string> {
  let lastErr: any;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
      }
      return await res.text();
    } catch (err) {
      lastErr = err;
      await sleep(150 + Math.random() * 150);
    }
  }
  throw lastErr;
}

function isSuspectQuote(q: any) {
  const c = q?.c, d = q?.d, dp = q?.dp;
  if (typeof c !== "number" || !isFinite(c) || c === 0) return true;
  if ((d == null) && (dp == null)) return true;
  return false;
}

export const handler: Handler = async (event: HandlerEvent) => {
  const symbol = (event.queryStringParameters?.symbol || "").trim().toUpperCase();
  const wantCandles = (event.queryStringParameters?.candles ?? "1") !== "0"; // default = fetch candles
  const providerOverride = (event.queryStringParameters?.provider || "").trim().toLowerCase(); // "fh" | "fmp" | "av" | "stooq" | ""

  if (!symbol) {
    return { statusCode: 400, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ error: "Stock symbol is required" }) };
  }

  const FINN_KEY = process.env.FINNHUB_API_KEY;
  const AV_KEY   = process.env.ALPHAVANTAGE_API_KEY; // optional
  const FMP_KEY  = process.env.FMP_API_KEY;          // optional

  if (!FINN_KEY) {
    return { statusCode: 500, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ error: "FINNHUB_API_KEY is not configured on the server." }) };
  }

  try {
    const baseFinn = "https://finnhub.io/api/v1";
    const nowSec = Math.floor(Date.now() / 1000);
    const yearAgoSec = nowSec - 60 * 60 * 24 * 365;
    const cb = Date.now();

    const profileUrl = `${baseFinn}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${FINN_KEY}&cb=${cb}`;
    const quoteUrl   = `${baseFinn}/quote?symbol=${encodeURIComponent(symbol)}&token=${FINN_KEY}&cb=${cb}`;
    const dailyFinn  = `${baseFinn}/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=D&from=${yearAgoSec}&to=${nowSec}&token=${FINN_KEY}&cb=${cb}`;

    // 1) Profile
    const profile = await fetchJson(profileUrl);
    if (!profile?.name) {
      return { statusCode: 404, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        body: JSON.stringify({ error: `Stock symbol '${symbol}' not found.` }) };
    }

    // 2) Quote (retry + fallback to prevClose)
    let quote = await fetchJson(quoteUrl);
    if (isSuspectQuote(quote)) {
      await sleep(200 + Math.random() * 200);
      quote = await fetchJson(quoteUrl);
    }
    if (isSuspectQuote(quote)) {
      quote = { ...quote, c: quote?.pc ?? 0, d: quote?.d ?? 0, dp: quote?.dp ?? 0 };
    }

    // 3) Candles (optional)
    type Candle = { t:number; o:number; h:number; l:number; c:number; v?:number };
    let daily: Candle[] = [];
    let week52High = 0, week52Low = 0, volumeToday = 0;
    let candlesSource: "none" | "finnhub" | "fmp" | "alphavantage" | "stooq" = "none";
    const candlesErrors: Record<string, string> = {};

    if (wantCandles) {
      const tryFinnhub = async () => {
        try {
          const c = await fetchJson(dailyFinn);
          if (c?.s === "ok" && Array.isArray(c?.t) && c.t.length > 1) {
            daily = c.t.map((t: number, i: number) => ({
              t: t * 1000, o: c.o[i], h: c.h[i], l: c.l[i], c: c.c[i], v: c.v?.[i],
            })).filter((d:any) => Number.isFinite(d.c));
            candlesSource = "finnhub";
          } else {
            throw new Error("Finnhub candles unavailable");
          }
        } catch (e:any) { candlesErrors.finnhub = String(e?.message || e); throw e; }
      };

      const tryFmp = async () => {
        try {
          if (!FMP_KEY) throw new Error("FMP_API_KEY not set");
          const fmpUrl = `https://financialmodelingprep.com/api/v3/historical-price-full/${encodeURIComponent(symbol)}?timeseries=252&apikey=${FMP_KEY}`;
          const f = await fetchJson(fmpUrl);
          const hist = f?.historical;
          if (Array.isArray(hist) && hist.length > 1) {
            daily = hist.slice().reverse().map((row:any) => ({
              t: new Date(row.date + "T00:00:00Z").getTime(),
              o: Number(row.open),
              h: Number(row.high),
              l: Number(row.low),
              c: Number(row.close),
              v: Number(row.volume),
            })).filter((d:any) => Number.isFinite(d.c));
            const last = daily[daily.length - 1];
            volumeToday = Number(last?.v) || 0;
            candlesSource = "fmp";
          } else {
            throw new Error("FMP historical missing");
          }
        } catch (e:any) { candlesErrors.fmp = String(e?.message || e); throw e; }
      };

      const tryAlphaVantage = async () => {
        try {
          if (!AV_KEY) throw new Error("ALPHAVANTAGE_API_KEY not set");
          const avDailyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=compact&apikey=${AV_KEY}`;
          const avDaily = await fetchJson(avDailyUrl);
          const series = avDaily?.["Time Series (Daily)"];
          if (series && typeof series === "object") {
            const entries = Object.entries(series) as [string, any][];
            entries.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
            daily = entries.map(([date, v]) => ({
              t: new Date(date + "T00:00:00Z").getTime(),
              o: parseFloat(v["1. open"]),
              h: parseFloat(v["2. high"]),
              l: parseFloat(v["3. low"]),
              c: parseFloat(v["4. close"]),
              v: parseFloat(v["5. volume"]),
            })).filter(d => Number.isFinite(d.c));
            const last = daily[daily.length - 1];
            volumeToday = Number(last?.v) || 0;
            candlesSource = "alphavantage";
          } else {
            throw new Error("AlphaVantage daily series missing");
          }
        } catch (e:any) { candlesErrors.alphavantage = String(e?.message || e); throw e; }
      };

      const tryStooq = async () => {
        try {
          // Stooq free, no key. US tickers usually need ".us"
          const symLower = symbol.toLowerCase();
          const stooqUrl = `https://stooq.com/q/d/l/?s=${encodeURIComponent(symLower)}.us&i=d`;
          const csv = await fetchText(stooqUrl);
          // CSV: Date,Open,High,Low,Close,Volume\nYYYY-MM-DD, ...
          const lines = csv.trim().split(/\r?\n/);
          if (!lines.length || !/^date,open,high,low,close,volume/i.test(lines[0])) {
            throw new Error("Unexpected Stooq CSV header");
          }
          const rows = lines.slice(1).map(line => line.split(","));
          const parsed = rows
            .filter(cols => cols.length >= 6 && cols[0] && cols[1] && cols[4])
            .map(cols => ({
              t: new Date(cols[0] + "T00:00:00Z").getTime(),
              o: Number(cols[1]),
              h: Number(cols[2]),
              l: Number(cols[3]),
              c: Number(cols[4]),
              v: Number(cols[5]),
            }))
            .filter(d => Number.isFinite(d.c))
            .sort((a,b) => a.t - b.t);
          if (parsed.length > 1) {
            daily = parsed;
            const last = daily[daily.length - 1];
            volumeToday = Number(last?.v) || 0;
            candlesSource = "stooq";
          } else {
            throw new Error("Stooq CSV empty");
          }
        } catch (e:any) { candlesErrors.stooq = String(e?.message || e); throw e; }
      };

      try {
        if      (providerOverride === "fh")    await tryFinnhub();
        else if (providerOverride === "fmp")   await tryFmp();
        else if (providerOverride === "av")    await tryAlphaVantage();
        else if (providerOverride === "stooq") await tryStooq();
        else {
          // Default order: Finnhub → FMP → Alpha Vantage → Stooq
          try { await tryFinnhub(); }
          catch { try { await tryFmp(); }
          catch { try { await tryAlphaVantage(); }
          catch { await tryStooq().catch(() => {}); } } }
        }
      } catch {
        daily = []; candlesSource = "none";
      }

      // derive 52w from whatever candles we got
      if (daily.length > 0) {
        let hi = -Infinity, lo = Infinity;
        for (const d of daily) {
          if (isFinite(d.h) && d.h > hi) hi = d.h;
          if (isFinite(d.l) && d.l < lo) lo = d.l;
        }
        if (isFinite(hi)) week52High = hi;
        if (isFinite(lo)) week52Low = lo;
        const last = daily[daily.length - 1];
        if (!volumeToday) volumeToday = Number(last?.v) || 0;
      }

      // If you want to see exactly why providers failed, include errors in _meta:
      (candlesSource === "none") && (candlesErrors.message ||= "All providers failed");
    }

    if (daily.length > MAX_DAILY) {
  daily = daily.slice(daily.length - MAX_DAILY);
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
        peRatio: 0,
        week52High,
        week52Low,
        volume: volumeToday,
      },
      daily, // may be []
      _meta: {
        ts: Date.now(),
        candlesSource,
        providers: { finnhub: !!FINN_KEY, fmp: !!FMP_KEY, alphavantage: !!AV_KEY, stooq: true },
        candlesErrors: wantCandles ? (Object.keys(candlesErrors).length ? candlesErrors : undefined) : undefined,
      },
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify(combined),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ error: error?.message || String(error) }),
    };
  }
};
