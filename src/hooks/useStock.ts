// src/hooks/useStock.ts
import { useEffect, useRef, useState } from "react";
import type { StockResponse } from "../types/stock";
import { fetchStock } from "../lib/api";

type Status = "idle" | "loading" | "ok" | "error";

type Options = {
  /** Polling interval in ms. Use 0 or undefined to disable polling. */
  refreshMs?: number;
  /**
   * Optional initial data to render immediately (e.g., from your mock).
   * Pass either the object or a function returning it, so we don't compute it on every render.
   */
  initial?: StockResponse | (() => StockResponse);
  /** Optional error callback */
  onError?: (err: unknown) => void;
};

export function useStock(symbol: string, opts: Options = {}) {
  const { refreshMs = 15000, initial, onError } = opts;

  const initialValue =
    typeof initial === "function" ? (initial as () => StockResponse)() : initial;

  const [data, setData] = useState<StockResponse | null>(initialValue ?? null);
  const [status, setStatus] = useState<Status>(initialValue ? "ok" : "idle");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(
    initialValue?._meta?.ts ?? null
  );

  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const doFetch = async () => {
    // Cancel any in-flight request for an old symbol
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus((s) => (s === "ok" ? "ok" : "loading")); // keep UI stable if we already have data

    try {
      const next = await fetchStock(symbol);
      if (controller.signal.aborted) return;

      setData(next);
      setStatus("ok");
      setError(null);
      setLastUpdated(next?._meta?.ts ?? Date.now());
    } catch (e: any) {
      if (controller.signal.aborted) return;

      setStatus((s) => (data ? "ok" : "error")); // keep last good data if we have it
      setError(e?.message || "Unknown error");
      onError?.(e);
    }
  };

  // Kick off fetch when symbol changes
  useEffect(() => {
    if (!symbol?.trim()) return;
    doFetch();

    return () => {
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  // Polling
  useEffect(() => {
    if (!refreshMs) return;

    timerRef.current = window.setInterval(() => {
      // Only poll if we have a symbol
      if (symbol?.trim()) doFetch();
    }, refreshMs) as unknown as number;

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, refreshMs]);

  const refresh = () => doFetch();

  return { data, status, error, lastUpdated, refresh };
}
