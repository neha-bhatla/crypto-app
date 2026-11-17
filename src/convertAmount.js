export function convertAmount(amount, fromPrice, toPrice) {
  if (amount === "" || !Number.isFinite(Number(amount)) || Number(amount) < 0 ||
      !Number.isFinite(fromPrice) || fromPrice <= 0 ||
      !Number.isFinite(toPrice) || toPrice <= 0) return null;
  const result = Number(amount) * fromPrice / toPrice;
  return Number.isFinite(result) ? result : null;
}

