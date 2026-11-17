export default function RequestStatus({ status, empty, onRetry, label }) {
  if (status === "loading") return <p role="status">Loading {label}…</p>;
  if (status === "error") return <div role="alert"><p>Could not load {label}. The market data service may be unavailable.</p><button type="button" onClick={onRetry}>Try again</button></div>;
  if (empty) return <p role="status">No {label} available.</p>;
  return null;
}
