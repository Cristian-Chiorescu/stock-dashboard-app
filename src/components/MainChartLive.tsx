import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import GlassPanel from "./GlassPanel";
import type { Candle } from "../types/stock";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type Props = {
  symbol: string;
  daily: Candle[]; // live daily candles (may be empty)
};

// Approximate trading-day windows (fallback until you add intraday):
const TF_WINDOWS: Record<"1D" | "5D" | "1M" | "6M" | "1Y", number> = {
  "1D": 2,    // need at least 2 points to draw a line
  "5D": 5,
  "1M": 22,   // ~22 trading days
  "6M": 126,  // ~126 trading days
  "1Y": 252,  // ~252 trading days
};

const fmtLabel = (ms: number) =>
  new Date(ms).toLocaleDateString(undefined, { month: "short", day: "numeric" });

export default function MainChartLive({ symbol, daily }: Props) {
  const [timeframe, setTimeframe] = useState<"1D" | "5D" | "1M" | "6M" | "1Y">("1Y");

  const series = useMemo(() => {
    const needed = TF_WINDOWS[timeframe];
    const slice = daily.slice(Math.max(0, daily.length - needed));
    const labels = slice.map((c) => fmtLabel(c.t));
    const data = slice.map((c) => c.c);
    return { labels, data, count: slice.length };
  }, [daily, timeframe]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: {
        ticks: { color: "rgba(255, 255, 255, 0.7)" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          callback: (v: any) =>
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
            }).format(Number(v)),
        },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  const dataForChart = {
    labels: series.labels,
    datasets: [
      {
        label: `${symbol} Price`,
        data: series.data,
        borderColor: "rgb(56, 189, 248)",
        backgroundColor: (context: any) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "rgba(56, 189, 248, 0.25)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(56, 189, 248, 0.5)");
          gradient.addColorStop(1, "rgba(56, 189, 248, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const getButtonClass = (btn: string) =>
    `px-2 py-1 text-sm rounded-md sm:px-3 transition-colors ${
      timeframe === btn
        ? "bg-white/20 text-white"
        : "bg-white/5 text-gray-400 hover:bg-white/10 cursor-pointer"
    }`;

  return (
  <GlassPanel>
    
    <div className="flex justify-between">
        <div className="text-sm text-gray-400">Live</div>
    <div className="flex justify-end gap-2 mb-4">
        
      <button className={getButtonClass("1D")} onClick={() => setTimeframe("1D")}>1D</button>
      <button className={getButtonClass("5D")} onClick={() => setTimeframe("5D")}>5D</button>
      <button className={getButtonClass("1M")} onClick={() => setTimeframe("1M")}>1M</button>
      <button className={getButtonClass("6M")} onClick={() => setTimeframe("6M")}>6M</button>
      <button className={getButtonClass("1Y")} onClick={() => setTimeframe("1Y")}>1Y</button>
    </div>
    </div>

    <div className="h-48 sm:h-60">
      {series.count >= 2 ? (
        <Line options={options} data={dataForChart} />
      ) : (
        <div className="h-full flex items-center justify-center text-sm text-gray-300">
          Not enough live data for this timeframe yet. Try a longer range or press Refresh.
        </div>
      )}
    </div>
  </GlassPanel>
);
}

