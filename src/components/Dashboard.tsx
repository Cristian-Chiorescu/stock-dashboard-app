// import { mockStockDetails } from "./mockData";

// import MainChart from "./MainChart";
// import StatisticsCard from "./StatisticsCard";

import { useStock } from "../hooks/useStock";
import KeyInfoCardLive from "./KeyInfoCardLive";
import MainChartLive from "./MainChartLive";
import StatisticsCardLive from "./StatisticsCardLive";
import WatchlistLive from "./WatchlistLive";

import KeyInfoCardSkeleton from "./skeletons/KeyInfoCardSkeleton";
import ChartSkeleton from "./skeletons/ChartSkeleton";
import StatsCardSkeleton from "./skeletons/StatsCardSkeleton";

type DashboardProps = {
  symbol: string;
  setSymbol: (symbol: string) => void;
};

const Dashboard = ({ symbol, setSymbol }: DashboardProps) => {
  const {
    data: live,
    status,
    error,
    lastUpdated,
    refresh,
  } = useStock(symbol, {
    refreshMs: 60000,
    clearOnSymbolChange: true,
  });

  // const data = mockStockDetails[symbol];

  const livePoints = (live?.daily ?? []).filter((d) => Number.isFinite(d?.c));
  const hasLiveDaily = livePoints.length >= 2;
  // const hasMock = !!data;
  // const isLoading = status === "idle" || status === "loading";
  const notFound =
    status === "error" &&
    /\b(404|not\s*found|Stock symbol '.*' not found)\b/i.test(error ?? "");
  const liveStatsReady =
    !!live?.stats &&
    ((live.stats.marketCap ?? 0) !== 0 ||
      (live.stats.week52High ?? 0) !== 0 ||
      (live.stats.week52Low ?? 0) !== 0 ||
      (live.stats.volume ?? 0) !== 0 ||
      (live.stats.peRatio ?? 0) !== 0);

  return (
    <div className="max-w-screen-xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          {notFound ? (
            <div className="bg-black/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/10 p-6 text-sm text-gray-300">
              Couldn’t find a stock with symbol{" "}
              <span className="font-semibold">{symbol.toUpperCase()}</span>. Try
              another ticker (e.g., AAPL) or pick one from the watchlist.
            </div>
          ) : hasLiveDaily ? (
            <KeyInfoCardLive
              data={live}
              status={status}
              error={error}
              lastUpdated={lastUpdated}
              onRefresh={refresh}
            />
          ) : (
            <KeyInfoCardSkeleton />
          )}

          {notFound ? (
            <div className="bg-black/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/10 p-6 text-sm text-gray-300">
              No chart available because the ticker was not found.
            </div>
          ) : hasLiveDaily ? (
            <MainChartLive symbol={live!.symbol} daily={livePoints} />
          ) : (
            <ChartSkeleton />
          )}

          {notFound ? (
            <div className="bg-black/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/10 p-6 text-sm text-gray-300">
              No statistics because the ticker was not found.
            </div>
          ) : liveStatsReady ? (
            <StatisticsCardLive stats={live!.stats} />
          ) : (
            <StatsCardSkeleton />
          )}
        </div>
        <div className="md:col-span-1">
          <WatchlistLive setSymbol={setSymbol} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
