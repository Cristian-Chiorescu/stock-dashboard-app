import { mockStockDetails } from "./mockData";

type WatchlistItemProps = {
  symbol: string;
  setSymbol: (symbol: string) => void;

  // NEW: optional live values (when provided, they override mock)
  name?: string | null;
  price?: number | null;
  change?: number | null;
  percentChange?: number | null;
};

function fmtPrice(n: number | null | undefined) {
  if (n == null || !isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

function fmtPct(n: number | null | undefined) {
  if (n == null || !isFinite(n)) return "—";
  return `${n.toFixed(2)}%`;
}

const WatchlistItem = ({
  symbol,
  setSymbol,
  name,
  price,
  change,
  percentChange,
}: WatchlistItemProps) => {
  const mock = mockStockDetails[symbol];

  // Prefer live props if present; otherwise fall back to mock
  const displayName = name ?? mock?.name ?? symbol;
  const displayPrice = (price ?? mock?.quote?.price) ?? null;
  const displayChange = (change ?? mock?.quote?.change) ?? null;
  const displayPct = (percentChange ?? mock?.quote?.percentChange) ?? null;

  const isUp = typeof displayChange === "number" && displayChange > 0;
  const isDown = typeof displayChange === "number" && displayChange < 0;

  // If neither live nor mock exist for this symbol, hide the row
  if (!mock && displayPrice == null && displayPct == null) return null;

  return (
    <div
      onClick={() => setSymbol(symbol)}
      className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-transform hover:-translate-y-1"
      title={`Select ${symbol}`}
    >
      <div>
        <p className="font-bold text-white">{symbol}</p>
        <p className="text-sm text-gray-300">{displayName}</p>
      </div>

      <div className="text-right">
        <p className="font-semibold text-white">{fmtPrice(displayPrice)}</p>
        <p
          className={[
            "text-sm",
            isUp ? "text-green-400" : "",
            isDown ? "text-red-400" : "",
            !isUp && !isDown ? "text-white/70" : "",
          ].join(" ")}
        >
          {displayChange != null && isFinite(displayChange) && displayChange >= 0 ? "+" : ""}
          {typeof displayChange === "number" ? displayChange.toFixed(2) : "—"}{" "}
          ({fmtPct(displayPct)})
        </p>
      </div>
    </div>
  );
};

export default WatchlistItem;
