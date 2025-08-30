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
  'AMZN': {
    name: "Amazon.com, Inc.",
    symbol: "AMZN",
    quote: {
      price: 185.30,
      change: 1.10,
      percentChange: 0.60,
    },
    stats: {
      marketCap: 1950000000000,
      peRatio: 51.3,
      week52High: 191.70,
      week52Low: 124.70,
      volume: 40000000,
    },
    chart: {
      '1D': { labels: ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm'], data: [184.20, 184.50, 184.80, 185.00, 185.10, 185.20, 185.25, 185.30] },
      '5D': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: [180.00, 182.50, 181.90, 183.00, 185.30] },
      '1M': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [178.00, 179.50, 182.10, 185.30] },
      '6M': { labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], data: [175.00, 177.80, 180.00, 182.50, 184.00, 185.30] },
      '1Y': { labels: ['Q3 \'24', 'Q4 \'24', 'Q1 \'25', 'Q2 \'25', 'Q3 \'25'], data: [130.00, 145.50, 160.00, 175.80, 185.30] },
    }
  },
  'TSLA': {
    name: "Tesla, Inc.",
    symbol: "TSLA",
    quote: {
      price: 182.40,
      change: -2.80,
      percentChange: -1.51,
    },
    stats: {
      marketCap: 580000000000,
      peRatio: 40.8,
      week52High: 299.29,
      week52Low: 138.80,
      volume: 110000000,
    },
    chart: {
      '1D': { labels: ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm'], data: [185.20, 184.50, 183.00, 183.50, 182.90, 182.00, 182.20, 182.40] },
      '5D': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: [190.00, 188.50, 185.20, 183.00, 182.40] },
      '1M': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [170.00, 175.80, 185.00, 182.40] },
      '6M': { labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], data: [200.00, 180.50, 175.00, 190.20, 185.80, 182.40] },
      '1Y': { labels: ['Q3 \'24', 'Q4 \'24', 'Q1 \'25', 'Q2 \'25', 'Q3 \'25'], data: [250.00, 220.10, 180.50, 195.00, 182.40] },
    }
  },
  'JPM': {
    name: "JPMorgan Chase & Co.",
    symbol: "JPM",
    quote: {
      price: 201.50,
      change: 0.75,
      percentChange: 0.37,
    },
    stats: {
      marketCap: 570000000000,
      peRatio: 12.1,
      week52High: 205.88,
      week52Low: 138.47,
      volume: 12000000,
    },
    chart: {
      '1D': { labels: ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm'], data: [200.75, 200.90, 201.00, 201.20, 201.30, 201.40, 201.45, 201.50] },
      '5D': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: [198.00, 199.50, 200.10, 200.80, 201.50] },
      '1M': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [195.00, 196.80, 199.20, 201.50] },
      '6M': { labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], data: [185.00, 188.50, 192.30, 196.00, 198.90, 201.50] },
      '1Y': { labels: ['Q3 \'24', 'Q4 \'24', 'Q1 \'25', 'Q2 \'25', 'Q3 \'25'], data: [145.00, 160.20, 175.80, 188.00, 201.50] },
    }
  },
  'BRK-B': {
    name: "Berkshire Hathaway Inc.",
    symbol: "BRK-B",
    quote: {
      price: 415.80,
      change: 1.20,
      percentChange: 0.29,
    },
    stats: {
      marketCap: 905000000000,
      peRatio: 9.8,
      week52High: 430.00,
      week52Low: 345.60,
      volume: 4500000,
    },
    chart: {
      '1D': { labels: ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm'], data: [414.60, 414.90, 415.00, 415.20, 415.50, 415.60, 415.70, 415.80] },
      '5D': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: [410.50, 412.30, 411.90, 413.50, 415.80] },
      '1M': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [405.00, 408.20, 410.10, 415.80] },
      '6M': { labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], data: [380.00, 390.50, 395.00, 400.20, 405.80, 415.80] },
      '1Y': { labels: ['Q3 \'24', 'Q4 \'24', 'Q1 \'25', 'Q2 \'25', 'Q3 \'25'], data: [350.00, 365.20, 380.00, 395.10, 415.80] },
    }
  }
};

export const mockWatchlist = ["AAPL", "MSFT", "GOOGL", "NVDA", "AMZN", "TSLA", "JPM", "BRK-B"];