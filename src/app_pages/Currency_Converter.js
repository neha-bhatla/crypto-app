import { useContext, useState } from "react";
import RequestStatus from "../app_components/RequestStatus";
import PageHeader from "../app_components/PageHeader";
import Icon from "../app_components/Icon";
import ListContext from "../app_store/List_Context";
import { convertAmount } from "../convertAmount";
import { money, number } from "../format";

export default function CurrencyConverter() {
  const { currencyList, assetsStatus, getCurrencyList, stale } = useContext(ListContext);
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("bitcoin");
  const [to, setTo] = useState("usd");
  const assets = [{ id: "usd", name: "US Dollar", symbol: "USD", priceUsd: 1 }, ...currencyList.filter(asset => Number(asset.priceUsd) > 0)];
  const fromAsset = assets.find(asset => asset.id === from);
  const toAsset = assets.find(asset => asset.id === to);
  const result = convertAmount(amount, Number(fromAsset?.priceUsd), Number(toAsset?.priceUsd));
  const unit = convertAmount("1", Number(fromAsset?.priceUsd), Number(toAsset?.priceUsd));
  const format = value => new Intl.NumberFormat("en-US", { maximumSignificantDigits: 10 }).format(value);
  const options = selected => <>{!assets.some(asset => asset.id === selected) && <option value={selected}>Waiting for market prices…</option>}{assets.map(asset => <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>)}</>;
  return <main className="main"><PageHeader title="Crypto converter" description="Less mental math. More clarity. Convert at current market prices."/>
    <div className="converter-layout"><section className="panel converter-panel"><div className="section-heading"><div><h2>A quick conversion</h2><p>Explore what your crypto is worth.</p></div><span className="round-icon"><Icon name="convert"/></span></div>
      <RequestStatus status={assetsStatus} label="market prices" onRetry={getCurrencyList}/>
      {stale && <p className="notice">Using saved prices. Refresh to check for current rates.</p>}
      <div className="converter-body"><label className="field-label" htmlFor="from">You convert</label><div className="conversion-box"><select id="from" value={from} onChange={event => setFrom(event.target.value)}>{options(from)}</select><label className="sr-only" htmlFor="amount">Amount to convert</label><input id="amount" type="number" min="0" step="any" value={amount} onChange={event => setAmount(event.target.value)} placeholder="0.00"/><span className="muted">{fromAsset?.symbol || "Select a currency"}</span></div>
      <div className="swap-row"><span/><button className="swap-button" type="button" aria-label="Swap currencies" onClick={() => { setFrom(to); setTo(from); }}><Icon name="convert"/></button><span/></div>
      <label className="field-label" htmlFor="to">You receive</label><div className="conversion-box result-box"><select id="to" value={to} onChange={event => setTo(event.target.value)}>{options(to)}</select><output aria-live="polite" aria-label="Converted amount">{result === null ? "—" : format(result)}</output><span className="muted">{toAsset?.symbol || "Select a currency"}</span></div>
      {amount !== "" && Number(amount) < 0 && <p role="alert" className="negative">Enter an amount of zero or greater.</p>}
      <div className="conversion-rate"><span className="status-dot"/>{unit === null ? "Waiting for market prices" : `1 ${fromAsset.symbol} = ${format(unit)} ${toAsset.symbol}`}</div><p className="fine-print">An estimate, not a quote. Network fees, trading fees, and slippage are excluded.</p></div>
    </section><aside className="converter-aside"><div className="panel how-it-works"><p className="eyebrow">A LITTLE CONTEXT</p><h2>One price.<br/>Endless possibilities.</h2><p>Every conversion starts with each asset’s USD market price. Choose two currencies and we’ll do the math.</p><div className="formula">Amount × from price ÷ to price</div><p>Use the swap button to reverse the pair, or pick from the top {currencyList.length || "100"} assets.</p></div>
      <div className="panel pair-details"><h3>Your selected pair</h3><div><span>{fromAsset?.name || "From currency"}</span><strong>{money(fromAsset?.priceUsd)}</strong></div><div><span>{toAsset?.name || "To currency"}</span><strong>{money(toAsset?.priceUsd)}</strong></div><small>USD price per unit · {number(currencyList.length)} assets available</small></div></aside></div>
    <footer className="page-footer">Market prices are cached for 60 seconds to keep requests efficient.</footer>
  </main>;
}
