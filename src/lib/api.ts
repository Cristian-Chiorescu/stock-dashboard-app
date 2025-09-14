import type { StockResponse } from "../types/stock";

export type Provider = "fh" | "fmp" | "av" | "stooq";

export async function fetchStock(
  symbol: string,
  opts?: { withCandles?: boolean; provider?: Provider },
  signal?: AbortSignal
): Promise<StockResponse> {
  if (!symbol || !symbol.trim())
    throw new Error("fetchStock: symbol is required");

  const params = new URLSearchParams({ symbol: symbol.trim().toUpperCase() });
  if (opts?.withCandles === false) params.set("candles", "0"); // default is 1 on the server
  if (opts?.provider) params.set("provider", opts.provider);

  const url = `/.netlify/functions/getStockData?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal,
  });

  if (!res.ok) {
    let detail = "";
    try {
      const json = await res.json();
      detail = json?.error ? ` — ${json.error}` : "";
    } catch {}
    throw new Error(`fetchStock failed: ${res.status}${detail}`);
  }

  const data = (await res.json()) as StockResponse;
  if (!data || !data.symbol || !data.quote) {
    throw new Error("fetchStock: unexpected response shape");
  }
  return data;
}
