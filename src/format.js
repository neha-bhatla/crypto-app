export function money(value, compact = false) {
  if (value == null || !Number.isFinite(Number(value))) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD",
    ...(compact ? { notation: "compact", maximumFractionDigits: 2 } :
      { minimumFractionDigits: 2, maximumFractionDigits: Number(value) > 0 && Number(value) < 1 ? 6 : 2 }) }).format(value);
}
export function percent(value) {
  if (value == null || !Number.isFinite(Number(value))) return "—";
  return `${Number(value) >= 0 ? "+" : ""}${Number(value).toFixed(2)}%`;
}
export function number(value, compact = false) {
  if (value == null || !Number.isFinite(Number(value))) return "—";
  return new Intl.NumberFormat("en-US", { notation: compact ? "compact" : "standard", maximumFractionDigits: 2 }).format(value);
}
