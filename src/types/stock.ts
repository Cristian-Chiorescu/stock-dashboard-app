// src/types/stock.ts

export type Candle = {
  t: number;   // timestamp in ms
  o: number;   // open
  h: number;   // high
  l: number;   // low
  c: number;   // close
  v?: number;  // volume (optional)
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
  peRatio: number;     // may be 0 if unavailable
  week52High: number;  // may be 0 if unavailable
  week52Low: number;   // may be 0 if unavailable
  volume: number;      // may be 0 if unavailable
};

export type StockResponse = {
  name: string;
  symbol: string;
  quote: Quote;
  stats: Stats;
  daily: Candle[];     // can be []
  _meta: { ts: number };
};
