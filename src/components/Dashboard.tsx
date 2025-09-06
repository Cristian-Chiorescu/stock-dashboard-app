import { mockStockDetails } from "./mockData"
import KeyInfoCard from "./KeyInfoCard"
import MainChart from "./MainChart"
import StatisticsCard from "./StatisticsCard"
import Watchlist from "./Watchlist"
import { useStock } from "../hooks/useStock"
import KeyInfoCardLive from "./KeyInfoCardLive"
import MainChartLive from "./MainChartLive"
import StatisticsCardLive from "./StatisticsCardLive"
import WatchlistLive from "./WatchlistLive";
import GlassPanel from "./GlassPanel"


type DashboardProps = {
    symbol: string,
    setSymbol: (symbol:string) => void
}

const Dashboard = ({symbol, setSymbol}: DashboardProps) =>{

    const { data: live, status, error, lastUpdated, refresh } = useStock(symbol, {
  refreshMs: 60000, // 60s polling to avoid AV rate-limits
});


    const data = mockStockDetails[symbol] // mock (may be undefined)

  // Make a clean, filtered list of live points (guard against NaNs)
const livePoints = (live?.daily ?? []).filter(d => Number.isFinite(d?.c));
const hasLiveDaily = livePoints.length >= 2;
const hasMock = !!data;
const liveStatsReady =
  !!live?.stats &&
  (
    (live.stats.marketCap ?? 0) !== 0 ||
    (live.stats.week52High ?? 0) !== 0 ||
    (live.stats.week52Low ?? 0) !== 0 ||
    (live.stats.volume ?? 0) !== 0 ||
    (live.stats.peRatio ?? 0) !== 0
  );


    return(
        <div className="max-w-screen-xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-6">
                <KeyInfoCardLive data={live} status={status} error={error} lastUpdated={lastUpdated} onRefresh={refresh}/>
                 {/*<KeyInfoCard name={data.name} symbol={data.symbol} quote={data.quote}/>*/}
                
                {hasLiveDaily ? (
  <>
  <MainChartLive symbol={live!.symbol} daily={livePoints} />
    
  </>
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
) : hasMock ? (
  <StatisticsCard stats={data.stats} />
) : (
  <div className="rounded-2xl shadow p-6 bg-white border border-gray-100 text-sm text-gray-600">
    Live stats unavailable for this symbol on the current provider. Try another ticker or refresh later.
  </div>
)}
            </div>
            <div className="md:col-span-1">
                <WatchlistLive setSymbol={setSymbol}/>
            </div>
        </div>
        </div>
        
    )
}

export default Dashboard



/*<div className="flex flex-col items-center gap-10">
            <h1 className="text-4xl font-bold mb-4">{data.stock.name} ({data.stock.symbol})</h1>
            <div className="p-4 border rounded-lg max-w-xl">
                <p className="text-2xl">Price: ${data.stock.quote.price.toFixed(2)}</p>
                <p className="text-lg">Change: ${data.stock.quote.change.toFixed(2)} ({data.stock.quote.percentChange.toFixed(2)}%)</p>
                <p>Market Cap: ${(data.stock.stats.marketCap / 1e12).toFixed(2)}T</p>
            </div>
        </div>*/