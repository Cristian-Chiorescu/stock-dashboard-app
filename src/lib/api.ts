// src/lib/api.ts
import type { StockResponse } from "../types/stock";

/**
 * Fetch live stock data from your Netlify function.
 * - Assumes you're running `npx netlify dev` in dev, which proxies the function.
 * - In production (Netlify), this path is identical.
 */
export async function fetchStock(symbol: string): Promise<StockResponse> {
  if (!symbol || !symbol.trim()) {
    throw new Error("fetchStock: symbol is required");
  }

  const url = `/.netlify/functions/getStockData?symbol=${encodeURIComponent(
    symbol.trim().toUpperCase()
  )}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    // Try to surface a helpful error from the function if present
    let detail = "";
    try {
      const json = await res.json();
      detail = json?.error ? ` — ${json.error}` : "";
    } catch {}
    throw new Error(`fetchStock failed: ${res.status}${detail}`);
  }

  // Enforce runtime type expectations lightly (optional)
  const data = (await res.json()) as StockResponse;

  // Minimal sanity checks to prevent UI crashes
  if (!data || !data.symbol || !data.quote) {
    throw new Error("fetchStock: unexpected response shape");
  }

  return data;
}
