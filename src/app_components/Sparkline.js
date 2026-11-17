export default function Sparkline({ values = [], positive = true }) {
  const valid = values.filter(Number.isFinite);
  if (valid.length < 2) return <span className="muted">—</span>;
  const min = Math.min(...valid), range = Math.max(...valid) - min || 1;
  const points = valid.map((value, index) => `${index / (valid.length - 1) * 100},${27 - (value - min) / range * 24}`).join(" ");
  return <svg className={`sparkline ${positive ? "positive" : "negative"}`} viewBox="0 0 100 30" aria-hidden="true"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/></svg>;
}
