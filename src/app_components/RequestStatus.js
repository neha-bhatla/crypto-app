export default function RequestStatus({ status, empty, onRetry, label }) {
  if (status === "loading") return <div className="request-state" role="status"><span className="spinner"/>Loading {label}…</div>;
  if (status === "error") return <div className="request-state error-state" role="alert"><div><strong>We couldn’t reach the market.</strong><p>Check your connection or wait a minute before trying again.</p></div><button className="secondary-button" type="button" onClick={onRetry}>Retry {label}</button></div>;
  if (empty) return <div className="request-state" role="status">No {label} found. Try another search.</div>;
  return null;
}
