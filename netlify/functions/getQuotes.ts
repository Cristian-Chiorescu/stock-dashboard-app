import type { Handler, HandlerEvent } from "@netlify/functions";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function fetchJson(url: string, attempts = 2) {
  let last: any;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return await res.json();
    } catch (e) {
      last = e;
      await sleep(120 + Math.random() * 150);
    }
  }
  throw last;
}

export const handler: Handler = async (event: HandlerEvent) => {
  const raw = (event.queryStringParameters?.symbols || "").trim();
  if (!raw) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({ error: "symbols required" }),
    };
  }

  const input = raw
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
  const symbols = Array.from(new Set(input)).slice(0, 50);

  const FINN_KEY = process.env.FINNHUB_API_KEY;
  const FMP_KEY = process.env.FMP_API_KEY;

  if (!FINN_KEY) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({ error: "FINNHUB_API_KEY missing" }),
    };
  }

  let rows: Array<{
    symbol: string;
    price: number | null;
    change: number | null;
    percentChange: number | null;
  }> = [];
  let source: "fmp" | "finnhub" = "finnhub";
  const cb = Date.now();

  try {
    if (FMP_KEY) {
      const url = `https://financialmodelingprep.com/api/v3/quote/${encodeURIComponent(
        symbols.join(",")
      )}?apikey=${FMP_KEY}`;
      const data = await fetchJson(url);
      if (Array.isArray(data) && data.length) {
        const map = new Map<string, any>(
          data.map((d: any) => [String(d.symbol).toUpperCase(), d])
        );
        rows = symbols.map((sym) => {
          const d = map.get(sym);
          return {
            symbol: sym,
            price:
              typeof d?.price === "number"
                ? d.price
                : d?.price
                ? Number(d.price)
                : null,
            change:
              typeof d?.change === "number"
                ? d.change
                : d?.change
                ? Number(d.change)
                : null,
            percentChange:
              typeof d?.changesPercentage === "number"
                ? d.changesPercentage
                : typeof d?.changesPercentage === "string"
                ? Number(d.changesPercentage.replace("%", ""))
                : null,
          };
        });
        source = "fmp";
      } else {
        throw new Error("FMP batch empty");
      }
    } else {
      throw new Error("FMP key not set");
    }
  } catch {
    const base = "https://finnhub.io/api/v1/quote";
    const out: typeof rows = [];
    for (const sym of symbols) {
      try {
        const url = `${base}?symbol=${encodeURIComponent(
          sym
        )}&token=${FINN_KEY}&cb=${cb}`;
        const q = await fetchJson(url);
        out.push({
          symbol: sym,
          price: typeof q?.c === "number" && isFinite(q.c) ? q.c : null,
          change: typeof q?.d === "number" ? q.d : null,
          percentChange: typeof q?.dp === "number" ? q.dp : null,
        });
        await sleep(40);
      } catch {
        out.push({
          symbol: sym,
          price: null,
          change: null,
          percentChange: null,
        });
      }
    }
    rows = out;
    source = "finnhub";
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify({
      rows,
      _meta: { source, ts: Date.now(), count: rows.length },
    }),
  };
};
