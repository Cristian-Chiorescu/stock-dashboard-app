import WatchlistItem from "./WatchlistItem"
import GlassPanel from "./GlassPanel"
import { mockWatchlist } from "./mockData"

type WatchlistProps = {
    setSymbol: (symbol:string) => void
}

const Watchlist = ({setSymbol}:WatchlistProps) =>{
    return(
        <GlassPanel>
        <div className="grid md:grid-cols-1 sm:grid-cols-2 gap-6">
               {mockWatchlist.map(stockSymbol => (
                <WatchlistItem key={stockSymbol} symbol={stockSymbol} setSymbol={setSymbol}/>
               ))}
        </div>
        </GlassPanel>
        
    )
}

export default Watchlist