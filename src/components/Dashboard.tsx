import { mockStockDetails } from "./mockData"
import KeyInfoCard from "./KeyInfoCard"
import MainChart from "./MainChart"
import StatisticsCard from "./StatisticsCard"
import Watchlist from "./Watchlist"
import { useStock } from "../hooks/useStock"
import KeyInfoCardLive from "./KeyInfoCardLive"



type DashboardProps = {
    symbol: string,
    setSymbol: (symbol:string) => void
}

const Dashboard = ({symbol, setSymbol}: DashboardProps) =>{

    const { data: live, status, error, lastUpdated, refresh } = useStock(symbol, { refreshMs: 15000 })

    const loading = false
    const err = undefined
    const data = mockStockDetails[symbol]

    if (!data) {
    return <p className="text-center p-8">Data not found for symbol: {symbol} | Try searching for AAPL</p>;
    }

    if(loading){
        return <p className="text-center mt-8">Loading data...</p>
    }

    if(err){
        return <p className="text-center mt-8 text-red-500">Error: Could not fetch data for {symbol}</p>
    }

    return(
        <div className="max-w-screen-xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-6">
                <KeyInfoCardLive data={live} status={status} error={error} lastUpdated={lastUpdated} onRefresh={refresh}/>
                 <KeyInfoCard name={data.name} symbol={data.symbol} quote={data.quote}/>
                <MainChart chartData={data.chart}/>
                <StatisticsCard stats={data.stats}/>
            </div>
            <div className="md:col-span-1">
                <Watchlist setSymbol={setSymbol}/>
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