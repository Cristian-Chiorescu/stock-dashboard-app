import { useEffect, useRef, useState } from "react";

export type QuoteRow = {
  symbol: string;
  name?: string; // optional (we'll fill from a map)
  price: number | null;
  change: number | null;
  percentChange: number | null;
};

type Options = {
  refreshMs?: number;   // default 60s
  namesMap?: Record<string, string>; // optional map for company names
};

export function useQuotes(symbols: string[], opts: Options = {}) {
  const { refreshMs = 60000, namesMap = {} } = opts;

  const [rows, setRows] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);
  const lastSymbolsRef = useRef<string>("");

  async function loadOnce() {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading((prev) => prev && rows.length === 0);
    setError(null);

    try {
      const params = new URLSearchParams({ symbols: symbols.join(",") });
      const res = await fetch(`/.netlify/functions/getQuotes?${params.toString()}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const incoming = (json?.rows ?? []) as QuoteRow[];

      // decorate with names (if provided)
      const decorated = incoming.map((r) => ({
        ...r,
        name: namesMap[r.symbol] ?? r.name ?? "",
      }));

      setRows(decorated);
      setLoading(false);
    } catch (e: any) {
      if (controller.signal.aborted) return;
      setError(e?.message || "fetch error");
      setLoading(false);
    }
  }

  useEffect(() => {
  loadOnce();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  // initial & on symbols change
  useEffect(() => {
    const key = JSON.stringify(symbols.map((s) => s.trim().toUpperCase()).sort());
    if (key !== lastSymbolsRef.current) {
      lastSymbolsRef.current = key;
      setLoading(true);
      loadOnce();
    }
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(symbols)]);

  // polling
  useEffect(() => {
    if (!refreshMs) return;
    timerRef.current = window.setInterval(() => {
      loadOnce();
    }, refreshMs) as unknown as number;
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshMs, JSON.stringify(symbols)]);

  const refresh = () => loadOnce();

  return { rows, loading, error, refresh };
}

