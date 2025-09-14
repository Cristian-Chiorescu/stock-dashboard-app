import GlassPanel from "./GlassPanel";
import { useQuotes } from "../hooks/useQuotes";
import WatchlistItem from "./WatchlistItem";
import WatchlistItemSkeleton from "./skeletons/WatchlistItemSkeleton";
import { WATCHLIST_SYMBOLS, WATCHLIST_NAMES } from "../config/watchlist";

type Props = {
  setSymbol: (s: string) => void;
  symbols?: string[];
};

export default function WatchlistLive({ setSymbol, symbols }: Props) {
  const tickers = symbols ?? WATCHLIST_SYMBOLS;
  const { rows, loading, error, refresh } = useQuotes(tickers, {
    refreshMs: 60000,
    namesMap: WATCHLIST_NAMES,
  });

  return (
    <GlassPanel>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-sm text-gray-400">Live</div>
          <h3 className="text-xl font-bold text-white">Watchlist</h3>
        </div>
        <button
          className="text-sm px-3 py-1 mb-4 rounded-lg border hover:bg-white/20 cursor-pointer"
          onClick={refresh}
        >
          Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-1 sm:grid-cols-2 gap-6">
        {loading && rows.length === 0
          ? (symbols ?? WATCHLIST_SYMBOLS)
              .slice(0, 6)
              .map((_, i) => <WatchlistItemSkeleton key={i} />)
          : rows.map((r) => (
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

      {error && (
        <div className="mt-3 text-[11px] text-amber-300/80">
          Some quotes didn't load. Try to Refresh in a bit.
        </div>
      )}
    </GlassPanel>
  );
}
