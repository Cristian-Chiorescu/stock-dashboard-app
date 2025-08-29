interface ChartTimeframes {
  '1D': { labels: string[], data: number[] },
  '5D': { labels: string[], data: number[] },
  '1M': { labels: string[], data: number[] },
  '6M': { labels: string[], data: number[] },
  '1Y': { labels: string[], data: number[] },
}

interface StockData {
    name: string,
    symbol: string,
    quote: { price: number, change: number, percentChange: number },
    stats: { marketCap: number, peRatio: number, week52High: number, week52Low: number, volume: number },
    chart: ChartTimeframes,
}



export const mockStockDetails: {[key:string]:StockData}={
'AAPL': {
    name: "Apple Inc.",
    symbol: "AAPL",
    quote: { price: 175.50, change: 2.75, percentChange: 1.59 },
    stats: { marketCap: 2.8e12, peRatio: 29.5, week52High: 198.23, week52Low: 155.45, volume: 52e6 },
    chart: {
      '1D': { labels: ['9 AM', '11 AM', '1 PM', '3 PM'], data: [175, 178, 177, 179] },
      '5D': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: [172, 175, 176, 175, 178] },
      '1M': { labels: ['W1', 'W2', 'W3', 'W4'], data: [168, 172, 170, 178] },
      '6M': { labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], data: [165, 168, 162, 175, 172, 178] },
      '1Y': { labels: ['Sep', 'Nov', 'Jan', 'Mar', 'May', 'Jul', 'Aug'], data: [155, 160, 165, 163, 172, 170, 178] },
    }
  },
  'MSFT': {
    name: "Microsoft Corp.",
    symbol: "MSFT",
    quote: { price: 450.50, change: 5.15, percentChange: 1.15 },
    stats: { marketCap: 3.1e12, peRatio: 35.2, week52High: 460.20, week52Low: 305.80, volume: 25e6 },
    chart: { 
      '1D': { labels: ['9 AM', '11 AM', '1 PM', '3 PM'], data: [450, 452, 449, 453] },
      '5D': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: [445, 450, 451, 448, 453] },
      '1M': { labels: ['W1', 'W2', 'W3', 'W4'], data: [430, 445, 440, 453] },
      '6M': { labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], data: [410, 420, 415, 435, 440, 453] },
      '1Y': { labels: ['Sep', 'Nov', 'Jan', 'Mar', 'May', 'Jul', 'Aug'], data: [390, 400, 410, 405, 425, 430, 453] },
    }
  },
  'GOOGL': {
    name: "Alphabet Inc.",
    symbol: "GOOGL",
    quote: { price: 180.25, change: -0.90, percentChange: -0.50 },
    stats: { marketCap: 2.1e12, peRatio: 26.8, week52High: 185.50, week52Low: 120.10, volume: 30e6 },
    chart: { 
      '1D': { labels: ['9 AM', '11 AM', '1 PM', '3 PM'], data: [180, 181, 179, 180.5] },
      '5D': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: [178, 180, 181, 179, 180.25] },
      '1M': { labels: ['W1', 'W2', 'W3', 'W4'], data: [175, 178, 176, 180.25] },
      '6M': { labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], data: [160, 165, 170, 175, 172, 180.25] },
      '1Y': { labels: ['Sep', 'Nov', 'Jan', 'Mar', 'May', 'Jul', 'Aug'], data: [140, 150, 160, 155, 165, 175, 180.25] },
    }
  },
   'NVDA': {
    name: "NVIDIA Corp.",
    symbol: "NVDA",
    quote: { price: 130.70, change: 3.20, percentChange: 2.50 },
    stats: { marketCap: 3.2e12, peRatio: 70.1, week52High: 140.76, week52Low: 45.30, volume: 45e6 },
    chart: { 
      '1D': { labels: ['9 AM', '11 AM', '1 PM', '3 PM'], data: [130, 132, 129, 131] },
      '5D': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: [125, 130, 131, 128, 130.7] },
      '1M': { labels: ['W1', 'W2', 'W3', 'W4'], data: [110, 115, 120, 130.7] },
      '6M': { labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], data: [90, 100, 95, 110, 120, 130.7] },
      '1Y': { labels: ['Sep', 'Nov', 'Jan', 'Mar', 'May', 'Jul', 'Aug'], data: [70, 80, 90, 85, 100, 115, 130.7] },
    }
  },
};

export const mockWatchlist = ["AAPL", "MSFT", "GOOGL", "NVDA"];