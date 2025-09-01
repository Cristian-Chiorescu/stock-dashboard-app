import { useState, useEffect } from 'react';
import { mockStockDetails } from "./mockData"
import KeyInfoCard from "./KeyInfoCard"
import MainChart from "./MainChart"
import StatisticsCard from "./StatisticsCard"
import Watchlist from "./Watchlist"

interface LiveStockData {
  name: string;
  symbol: string;
  quote: {
    price: number;
    change: number;
    percentChange: number;
  };
  stats: {
    marketCap: number;
    peRatio: number;
    week52High: number;
    week52Low: number;
    volume: number;
  };
}

type DashboardProps = {
    symbol: string,
    setSymbol: (symbol:string) => void
}

const Dashboard = ({symbol, setSymbol}: DashboardProps) =>{

   const [data, setData] = useState<LiveStockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const response = await fetch(`/.netlify/functions/getStockData?symbol=${symbol}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch data');
        }

        setData(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

    if (loading) return <p className="text-center p-8">Loading live data for {symbol}...</p>;
  if (error) return <p className="text-center p-8 text-red-400">Error: {error}</p>;
  if (!data) return null;

 const chartData = mockStockDetails[symbol]?.chart;

    return(
        <div className="max-w-screen-xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-6">
                <KeyInfoCard name={data.name} symbol={data.symbol} quote={data.quote}/>
                {chartData && <MainChart chartData={chartData}/>}
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



// Triggering a new Netlify deploy