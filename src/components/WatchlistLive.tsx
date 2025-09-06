import GlassPanel from "./GlassPanel";
import { useQuotes } from "../hooks/useQuotes";
import WatchlistItem from "./WatchlistItem";
import { WATCHLIST_SYMBOLS, WATCHLIST_NAMES } from "../config/watchlist";


type Props = {
  setSymbol: (s: string) => void;
  symbols?: string[];
};


function fmtPrice(n: number | null) {
  if (n == null || !isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
}
function fmtChange(n: number | null, pct: number | null) {
  const c = (n == null || !isFinite(n)) ? "—" : n.toFixed(2);
  const p = (pct == null || !isFinite(pct)) ? "—" : pct.toFixed(2);
  return `${c} (${p}%)`;
}

export default function WatchlistLive({ setSymbol, symbols }: Props) {
  const tickers = symbols ?? WATCHLIST_SYMBOLS;
  const { rows, loading, error, refresh } = useQuotes(tickers, { refreshMs: 60000, namesMap: WATCHLIST_NAMES });

  return (
    <GlassPanel>
        
      <div className="flex items-center justify-between mb-5">
        <div>
        <div className="text-sm text-gray-400">Live</div>
        <h3 className="text-xl font-bold text-white">Watchlist</h3>
        </div>
        <button className="text-xs px-2 py-1 rounded-md border border-white/10 hover:bg-white/10" onClick={refresh}>
          Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-1 sm:grid-cols-2 gap-6">
        {rows.map((r) => (
    <WatchlistItem
      key={r.symbol}
      symbol={r.symbol}
      setSymbol={setSymbol}
      name={r.name}
      price={r.price}
      change={r.change}
      percentChange={r.percentChange}
    />
  ))}

  {loading && rows.length === 0 && (
    <div className="py-6 text-sm text-white/70">Loading quotes…</div>
  )}
      </div>

      {error && <div className="mt-3 text-[11px] text-amber-300/80">Some quotes didn’t load. Try Refresh in a bit.</div>}
    </GlassPanel>
  );
}
