// src/hooks/useStock.ts
import { useEffect, useRef, useState } from "react";
import type { StockResponse } from "../types/stock";
import { fetchStock, type Provider } from "../lib/api";

type Status = "idle" | "loading" | "ok" | "error";

type Options = {
  refreshMs?: number;
  onError?: (err: unknown) => void;
};

export function useStock(symbol: string, opts: Options = {}) {
  const { refreshMs = 15000, onError } = opts;

  const [data, setData] = useState<StockResponse | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const prevSymbolRef = useRef<string>("");

  async function doFetch(options: { withCandles?: boolean; provider?: Provider } = {}) {
    // cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus((s) => (s === "ok" ? "ok" : "loading")); // keep UI steady if we already have data

    try {
      const next = await fetchStock(symbol, {
        withCandles: options.withCandles,
        provider: options.provider,
      });
      if (controller.signal.aborted) return;

      setData((old) => {
        // If we skipped candles this time, preserve previous daily array
        if (options.withCandles === false && old?.daily?.length && !next.daily?.length) {
          return { ...next, daily: old.daily };
        }
        return next;
      });
      setStatus("ok");
      setError(null);
      setLastUpdated(next?._meta?.ts ?? Date.now());
    } catch (e: any) {
      if (controller.signal.aborted) return;
      setStatus((s) => (data ? "ok" : "error"));
      setError(e?.message || "Unknown error");
      onError?.(e);
    }
  }

  // On symbol change: fetch once WITH candles (prefer stooq to avoid quotas)
  useEffect(() => {
    if (!symbol?.trim()) return;

    if (symbol !== prevSymbolRef.current) {
      prevSymbolRef.current = symbol;
    }

    doFetch({ withCandles: true, provider: "stooq" });

    return () => {
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  // Poll QUOTES only (no candles) to avoid daily limits
  useEffect(() => {
    if (!refreshMs) return;

    timerRef.current = window.setInterval(() => {
      if (symbol?.trim()) {
        doFetch({ withCandles: false });
      }
    }, refreshMs) as unknown as number;

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, refreshMs]);

  const refresh = (withCandles = false, provider?: Provider) =>
    doFetch({ withCandles, provider });

  return { data, status, error, lastUpdated, refresh };
}
