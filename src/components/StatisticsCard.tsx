import GlassPanel from "./GlassPanel"

type StatisticsCardProps = {
    stats:{
        marketCap : number,
        peRatio: number,
        week52High: number,
        week52Low: number,
        volume: number,
    }
}

const StatisticsCard = ({stats}:StatisticsCardProps) =>{
    const formatLargeNumber = (num: number) => {
    if (num >= 1e12) {
      return `${(num / 1e12).toFixed(2)}T`; 
    }
    if (num >= 1e9) {
      return `${(num / 1e9).toFixed(2)}B`;
    }
    return num.toLocaleString();
  };

    return(
        <GlassPanel>
        <h3 className="text-xl font-bold text-white mb-4">Key Statistics</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      
        <div className="text-gray-300">Market Cap</div>
        <div className="text-white font-semibold text-right">{formatLargeNumber(stats.marketCap)}</div>
        
        <div className="text-gray-300">P/E Ratio</div>
        <div className="text-white font-semibold text-right">{stats.peRatio.toFixed(2)}</div>
        
        <div className="text-gray-300">52-Week High</div>
        <div className="text-white font-semibold text-right">${stats.week52High.toFixed(2)}</div>
        
        <div className="text-gray-300">52-Week Low</div>
        <div className="text-white font-semibold text-right">${stats.week52Low.toFixed(2)}</div>

        <div className="text-gray-300">Volume</div>
        <div className="text-white font-semibold text-right">{stats.volume.toLocaleString()}</div>
      </div>
        </GlassPanel>
    )
}

export default StatisticsCard