import { Line } from 'react-chartjs-2'
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
} from 'chart.js';
import GlassPanel from "./GlassPanel"
import { useState } from 'react';

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


type MainChartProps = {
    chartData : {
  '1D': { labels: string[], data: number[] },
  '5D': { labels: string[], data: number[] },
  '1M': { labels: string[], data: number[] },
  '6M': { labels: string[], data: number[] },
  '1Y': { labels: string[], data: number[] },
}
}

const MainChart = ({chartData}: MainChartProps) =>{

    const[timeframe, setTimeFrame] = useState<'1D' | '5D' | '1M' | '6M' | '1Y'>('1Y')

    const options = {
        responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        display: false, 
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
    }

    const dataForChart = {
    labels: chartData[timeframe].labels,
    datasets: [
      {
        label: 'Price',
        data: chartData[timeframe].data, 
        borderColor: 'rgb(56, 189, 248)', 
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
          gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
          return gradient;
        },
        fill: true, 
        tension: 0.4, 
        pointRadius: 0, 
      },
    ],
  };

  const getButtonClass = (buttonTimeframe: string) => {
    return `px-3 py-1 text-sm rounded-md transition-colors ${
      timeframe === buttonTimeframe
        ? 'bg-white/20 text-white'
        : 'bg-white/5 text-gray-400 hover:bg-white/10 cursor-pointer' 
    }`;
  };

    return(
        <GlassPanel>
    
      <div className="flex justify-end gap-2 mb-4">
        <button className={getButtonClass("1D")} onClick={() => setTimeFrame("1D")}>1D</button>
        <button className={getButtonClass("5D")} onClick={() => setTimeFrame("5D")}>5D</button>
        <button className={getButtonClass("1M")} onClick={() => setTimeFrame("1M")}>1M</button>
        <button className={getButtonClass("6M")} onClick={() => setTimeFrame("6M")}>6M</button>
        <button className={getButtonClass("1Y")} onClick={() => setTimeFrame("1Y")}>1Y</button>
      </div>

    
      <div className='h-48 sm:h-60'> 
        <Line options={options} data={dataForChart} />
      </div>
        </GlassPanel>
    )
}

export default MainChart