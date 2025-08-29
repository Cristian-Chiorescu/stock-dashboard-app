import GlassPanel from "./GlassPanel"

type KeyInfoCardProps={
    name:string,
    symbol: string,
    quote: {
        price: number,
        change: number,
        percentChange: number,
    }
}

const KeyInfoCard = ({name, symbol, quote}:KeyInfoCardProps) => {
    const isPositive = quote.change>=0

    return(
        <GlassPanel>
        <div>
        <h2 className="text-3xl font-bold text-white">{name}</h2>
        <p className="text-lg text-gray-300">{symbol}</p>
      </div>
      <div className="mt-4 flex flex-col md:flex-row justify-between md:items-end">
        <div>
          <p className="text-5xl font-bold text-white">${quote.price.toFixed(2)}</p>
        </div>
        <div className={`text-xl font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          <span>{isPositive ? '+' : ''}${quote.change.toFixed(2)}</span>
          <span className="ml-2">({quote.percentChange.toFixed(2)}%)</span>
        </div>
      </div>
        </GlassPanel>
    )
}

export default KeyInfoCard