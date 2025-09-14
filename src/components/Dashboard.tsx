import { mockStockDetails } from "./mockData";

import MainChart from "./MainChart";
import StatisticsCard from "./StatisticsCard";

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
  });

  const data = mockStockDetails[symbol];

  const livePoints = (live?.daily ?? []).filter((d) => Number.isFinite(d?.c));
  const hasLiveDaily = livePoints.length >= 2;
  const hasMock = !!data;
  const isLoading = status === "idle" || status === "loading";
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
          {isLoading && !live ? (
            <KeyInfoCardSkeleton />
          ) : (
            <KeyInfoCardLive
              data={live}
              status={status}
              error={error}
              lastUpdated={lastUpdated}
              onRefresh={refresh}
            />
          )}

          {hasLiveDaily ? (
            <>
              <MainChartLive symbol={live!.symbol} daily={livePoints} />
            </>
          ) : isLoading ? (
            <ChartSkeleton />
          ) : hasMock ? (
            <>
              <MainChart chartData={data.chart} />
            </>
          ) : (
            <div className="rounded-2xl shadow p-6 bg-white border border-gray-100 text-sm text-gray-600">
              Chart source: NONE (no live candles / no mock)
            </div>
          )}

          {liveStatsReady ? (
            <StatisticsCardLive stats={live!.stats} />
          ) : isLoading ? (
            <StatsCardSkeleton />
          ) : hasMock ? (
            <StatisticsCard stats={data.stats} />
          ) : (
            <div className="rounded-2xl shadow p-6 bg-white border border-gray-100 text-sm text-gray-600">
              Live stats unavailable for this symbol on the current provider.
              Try another ticker or refresh later.
            </div>
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
