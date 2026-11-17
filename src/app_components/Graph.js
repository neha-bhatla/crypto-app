import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import { money } from "../format";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function Graph({ data, labels, selectedCurrency }) {
  const positive = Number(data[data.length - 1]) >= Number(data[0]);
  const color = positive ? "#b8f36f" : "#f59595";
  const options = { responsive: true, maintainAspectRatio: false, animation: false,
    interaction: { intersect: false, mode: "index" },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: "#25292e", titleColor: "#b8bec5", bodyColor: "#fff", padding: 12, displayColors: false,
      callbacks: { label: context => money(context.parsed.y) } } },
    scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: "#7e8790", maxTicksLimit: 6, maxRotation: 0, font: { size: 11 } } },
      y: { position: "right", border: { display: false }, grid: { color: "#ffffff08" }, ticks: { color: "#7e8790", maxTicksLimit: 5, font: { size: 11 }, callback: value => money(value, true) } } } };
  return <div className="chart-canvas"><Line aria-label={`${selectedCurrency?.name || "Asset"} price history`} role="img" options={options} data={{ labels, datasets: [{ data, borderColor: color, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, tension: 0.2, fill: true,
    backgroundColor: context => { const chart = context.chart; const area = chart.chartArea; if (!area) return "transparent"; const gradient = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom); gradient.addColorStop(0, positive ? "#b8f32626" : "#f5959526"); gradient.addColorStop(1, "#11141600"); return gradient; } }] }}/></div>;
}
