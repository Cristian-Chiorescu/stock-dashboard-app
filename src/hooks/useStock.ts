import { useEffect, useRef, useState } from "react";
import type { StockResponse } from "../types/stock";
import { fetchStock, type Provider } from "../lib/api";

type Status = "idle" | "loading" | "ok" | "error";

type Options = {
  refreshMs?: number;
  onError?: (err: unknown) => void;
  clearOnSymbolChange?: boolean;
  loadTimeoutMs?: number;
  pollTimeoutMs?: number;
};

export function useStock(symbol: string, opts: Options = {}) {
  const {
    refreshMs = 15000,
    onError,
    clearOnSymbolChange = true,
    loadTimeoutMs = 5000,
    pollTimeoutMs = 5000,
  } = opts;

  const [data, setData] = useState<StockResponse | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const prevSymbolRef = useRef<string>("");

  async function doFetch(
    options: {
      withCandles?: boolean;
      provider?: Provider;
      timeoutMs?: number;
    } = {}
  ) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus((s) => (s === "ok" ? "ok" : "loading"));

    const timeoutMs =
      options.timeoutMs ??
      (options.withCandles ? loadTimeoutMs : pollTimeoutMs);

    const timer = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const next = await fetchStock(
        symbol,
        {
          withCandles: options.withCandles,
          provider: options.provider,
        },
        controller.signal
      );
      if (controller.signal.aborted) return;

      setData((old) => {
        if (
          options.withCandles === false &&
          old?.daily?.length &&
          !next.daily?.length
        ) {
          return { ...next, daily: old.daily };
        }
        return next;
      });
      setStatus("ok");
      setError(null);
      setLastUpdated(next?._meta?.ts ?? Date.now());
    } catch (e: any) {
      if (controller.signal.aborted) {
        setStatus("error");
        setError("Request timed out. Please try again.");
      } else {
        setStatus("error");
        setError(e?.message || "Unknown error");
      }
      onError?.(e);
    } finally {
      window.clearTimeout(timer);
    }
  }

  useEffect(() => {
    if (!symbol?.trim()) return;

    if (symbol !== prevSymbolRef.current) {
      prevSymbolRef.current = symbol;
    }

    if (clearOnSymbolChange) {
      setData(null);
      setStatus("loading");
      setError(null);
      setLastUpdated(null);
    }

    doFetch({ withCandles: true, provider: "stooq" });

    return () => {
      abortRef.current?.abort();
    };
  }, [symbol]);

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
  }, [symbol, refreshMs]);

  const refresh = (withCandles = false, provider?: Provider) =>
    doFetch({ withCandles, provider });

  return { data, status, error, lastUpdated, refresh };
}
