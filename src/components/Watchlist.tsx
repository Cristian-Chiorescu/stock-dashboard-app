import WatchlistItem from "./WatchlistItem"
import GlassPanel from "./GlassPanel"

const Watchlist = () =>{
    return(
        <GlassPanel className="m-4">
        <div className="grid md:grid-cols-1 sm:grid-cols-2 gap-6">
               <WatchlistItem/>
                <WatchlistItem/>
                <WatchlistItem/>
        </div>
        </GlassPanel>
        
    )
}

export default Watchlist