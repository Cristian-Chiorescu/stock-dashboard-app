const WatchlistItem = () =>{
    return(
        <div className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-transform hover:-translate-y-1">
            <div>
    <p className="font-bold text-white">MSFT</p>
    <p className="text-sm text-gray-300">Microsoft Corp.</p>
  </div>
  <div className="text-right">
    <p className="font-semibold text-white">$450.50</p>
    <p className="text-sm text-green-400">+1.15%</p> {/* Or text-red-400 */}
  </div>
        </div>
    )
}

export default WatchlistItem