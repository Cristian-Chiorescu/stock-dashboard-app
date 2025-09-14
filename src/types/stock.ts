export type Candle = {
  t: number; // timestamp in ms
  o: number; // open
  h: number; // high
  l: number; // low
  c: number; // close
  v?: number; // volume
};

export type Quote = {
  price: number;
  change: number | null;
  percentChange: number | null;
  prevClose: number | null;
  high: number | null;
  low: number | null;
  open: number | null;
};

export type Stats = {
  marketCap: number;
  peRatio: number;
  week52High: number;
  week52Low: number;
  volume: number;
};

export type StockResponse = {
  name: string;
  symbol: string;
  quote: Quote;
  stats: Stats;
  daily: Candle[];
  _meta: { ts: number };
};
