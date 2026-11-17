import { useContext, useState } from "react";
import RequestStatus from "../app_components/RequestStatus";
import ListContext from "../app_store/List_Context";

import { convertAmount } from "../convertAmount";

export default function CurrencyConverter() {
  const { currencyList, assetsStatus, getCurrencyList } = useContext(ListContext);
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("bitcoin");
  const assets = [{ id: "usd", name: "US Dollar", symbol: "USD", priceUsd: 1 },
    ...currencyList.filter(asset => Number(asset.priceUsd) > 0)];
  const price = id => Number(assets.find(asset => asset.id === id)?.priceUsd);
  const result = convertAmount(amount, price(from), price(to));
  return (
    <main className="main"><section className="crypto-converter">
      <h1>Crypto converter</h1>
      <p>Estimate conversions using the latest loaded USD market prices.</p>
      <RequestStatus status={assetsStatus} label="market prices" onRetry={getCurrencyList} />
      <label htmlFor="amount">Amount</label>
      <input id="amount" type="number" min="0" step="any" value={amount}
        onChange={event => setAmount(event.target.value)} />
      <label htmlFor="from">From</label>
      <select id="from" value={from} onChange={event => setFrom(event.target.value)}>
        {assets.map(asset => <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>)}
      </select>
      <label htmlFor="to">To</label>
      <select id="to" value={to} onChange={event => setTo(event.target.value)}>
        {!assets.some(asset => asset.id === to) && <option value={to}>Waiting for market prices</option>}
        {assets.map(asset => <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>)}
      </select>
      <button type="button" onClick={() => { setFrom(to); setTo(from); }}>Swap currencies</button>
      <output aria-live="polite">{result === null ? "Enter a valid amount and select available currencies." :
        `${new Intl.NumberFormat("en-US", { maximumSignificantDigits: 10 }).format(result)} ${assets.find(asset => asset.id === to)?.symbol}`}</output>
      <p>Estimates exclude fees and slippage.</p>
    </section></main>
  );
}
