import { mockStockDetails } from "./mockData"

type WatchlistItemProps = {
  symbol: string,
  setSymbol: (symbol:string) => void,
}

const WatchlistItem = ({symbol, setSymbol}: WatchlistItemProps) =>{
    const data = mockStockDetails[symbol]

    const isPositive = data.quote.change >= 0;

    if (!data) return null

    return(
        <div onClick={() => setSymbol(symbol)} className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-transform hover:-translate-y-1">
            <div>
    <p className="font-bold text-white">{data.symbol}</p>
    <p className="text-sm text-gray-300">{data.name}</p>
  </div>
  <div className="text-right">
    <p className="font-semibold text-white">${data.quote.price.toFixed(2)}</p>
    <p className={`text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>{isPositive? "+":""}{data.quote.percentChange.toFixed(2)}</p> {/* Or text-red-400 */}
  </div>
        </div>
    )
}

export default WatchlistItem