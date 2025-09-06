import type { Stats } from "../types/stock";
import GlassPanel from "./GlassPanel";

type Props = { stats?: Stats | null };

function fmtCurr(n?: number | null) {
  if (n == null || !isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    notation: "compact",
  }).format(n);
}

function fmtNum(n?: number | null) {
  if (n == null || !isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}

export default function StatisticsCardLive({ stats }: Props) {
  return (
    <GlassPanel>
        <div className="text-sm text-gray-400">Live</div>
      <h3 className="text-lg font-semibold mb-4">Key Statistics </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-gray-400">Market Cap</div>
          <div className="font-medium">{fmtCurr(stats?.marketCap)}</div>
        </div>
        <div>
          <div className="text-gray-400">P/E Ratio</div>
          <div className="font-medium">{fmtNum(stats?.peRatio)}</div>
        </div>
        <div>
          <div className="text-gray-400">52-Week High</div>
          <div className="font-medium">{fmtCurr(stats?.week52High || 0)}</div>
        </div>
        <div>
          <div className="text-gray-400">52-Week Low</div>
          <div className="font-medium">{fmtCurr(stats?.week52Low || 0)}</div>
        </div>
        <div>
          <div className="text-gray-400">Volume</div>
          <div className="font-medium">{fmtNum(stats?.volume || 0)}</div>
        </div>
      </div>
  
    </GlassPanel>
  );
}
