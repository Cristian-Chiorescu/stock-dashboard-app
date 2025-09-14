import type { StockResponse } from "../types/stock";
import GlassPanel from "./GlassPanel";

type Props = {
  data: StockResponse | null | undefined;
  status: "idle" | "loading" | "ok" | "error";
  error: string | null;
  lastUpdated: number | null;
  onRefresh: () => void;
};

function formatCurrency(n: number | null, currency = "USD") {
  if (n == null || !isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}
function formatNumber(n: number | null) {
  if (n == null || !isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}
function since(ts: number | null) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function KeyInfoCardLive({
  data,
  status,
  error,
  lastUpdated,
  onRefresh,
}: Props) {
  const price = data?.quote?.price ?? null;
  const change = data?.quote?.change ?? null;
  const pct = data?.quote?.percentChange ?? null;
  const up = typeof change === "number" && change > 0;
  const down = typeof change === "number" && change < 0;

  return (
    <GlassPanel>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-400">Live</div>
          <h2 className="text-xl font-semibold">
            {data?.name ?? "—"}{" "}
            <span className="text-gray-300 text-base">
              ({data?.symbol ?? "—"})
            </span>
          </h2>
        </div>
        <button
          className="text-sm px-3 py-1 rounded-lg border hover:bg-white/20 cursor-pointer"
          onClick={onRefresh}
          disabled={status === "loading"}
          aria-label="Refresh"
          title="Refresh"
        >
          {status === "loading" ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-3">
        <div className="text-3xl font-bold">{formatCurrency(price)}</div>
        <div
          className={[
            "text-sm px-2 py-1 rounded-md",
            up ? " text-green-400" : "",
            down ? "text-red-400" : "",
            !up && !down ? "bg-gray-100 text-gray-700" : "",
          ].join(" ")}
        >
          {formatNumber(change)} ({formatNumber(pct)}%)
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-gray-400">Open</div>
          <div className="font-medium">
            {formatCurrency(data?.quote?.open ?? null)}
          </div>
        </div>
        <div>
          <div className="text-gray-400">High</div>
          <div className="font-medium">
            {formatCurrency(data?.quote?.high ?? null)}
          </div>
        </div>
        <div>
          <div className="text-gray-400">Low</div>
          <div className="font-medium">
            {formatCurrency(data?.quote?.low ?? null)}
          </div>
        </div>
        <div>
          <div className="text-gray-400">Prev Close</div>
          <div className="font-medium">
            {formatCurrency(data?.quote?.prevClose ?? null)}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <div>
          Market Cap:{" "}
          <span className="font-medium">
            {data?.stats?.marketCap
              ? new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 2,
                }).format(data.stats.marketCap)
              : "—"}
          </span>
        </div>
        <div>Updated: {since(lastUpdated)}</div>
      </div>

      {status === "error" && (
        <div className="mt-3 text-xs text-red-400">Error: {error}</div>
      )}
    </GlassPanel>
  );
}
