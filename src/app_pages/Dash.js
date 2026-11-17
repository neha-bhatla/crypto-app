import { useContext, useState } from "react";
import CurrencyContext, { time_intervals } from "../app_store/Currency_Context";
import ListContext from "../app_store/List_Context";
import PageHeader from "../app_components/PageHeader";
import Graph from "../app_components/Graph";
import CurrencyInfo from "../app_components/Currency_Info";
import RequestStatus from "../app_components/RequestStatus";
import Icon from "../app_components/Icon";
import { money, percent } from "../format";

export default function Dash() {
  const ctx = useContext(CurrencyContext);
  const list = useContext(ListContext);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [watchlist, setWatchlist] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem("coinhub:watchlist")); return Array.isArray(saved) ? saved.filter(id => typeof id === "string") : []; } catch { return []; }
  });
  function toggleWatch(id) {
    setWatchlist(previous => { const next = previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id];
      try { localStorage.setItem("coinhub:watchlist", JSON.stringify(next)); } catch { /* Optional persistence. */ } return next; });
  }
  const selected = list.currencyList.find(asset => asset.id === ctx.selected_id);
  const trackedCap = list.currencyList.reduce((sum, asset) => sum + (asset.marketCapUsd || 0), 0);
  const trackedVolume = list.currencyList.reduce((sum, asset) => sum + (asset.volumeUsd || 0), 0);
  const btc = list.currencyList.find(asset => asset.id === "bitcoin");
  const labels = ctx.history.map(item => new Date(item.date).toLocaleString("en-US", ctx.interval === "1D" ? { hour: "numeric", minute: "2-digit" } : { month: "short", day: "numeric" }));
  return <main className="main">
    <PageHeader title="Market overview" description="Keep a pulse on crypto. Make sense of every move."/>
    {list.stale && <p className="notice">You’re viewing saved prices. Live data is temporarily unavailable; try refreshing in a minute.</p>}
    <div className="stats-grid">
      <div className="stat-card"><span>Tracked market cap <Icon name="chart" size={16}/></span><strong>{list.currencyList.length ? money(trackedCap, true) : "—"}</strong><small>Across {list.currencyList.length || "—"} leading assets</small></div>
      <div className="stat-card"><span>24h trading volume <Icon name="exchange" size={16}/></span><strong>{list.currencyList.length ? money(trackedVolume, true) : "—"}</strong><small>Volume across tracked assets</small></div>
      <div className="stat-card"><span>Bitcoin share <span className="mini-bitcoin">₿</span></span><strong>{trackedCap && btc ? `${(btc.marketCapUsd / trackedCap * 100).toFixed(1)}%` : "—"}</strong><small>Of tracked market capitalization</small></div>
    </div>
    <section id="price-chart" className="panel chart-panel" aria-label="Asset price chart">
      <div className="chart-toolbar"><div className="asset-heading">{selected?.image ? <img className="coin-image large" src={selected.image} alt=""/> : <span className="coin-placeholder">₿</span>}<div><h2>{selected?.name || "Bitcoin"} <span className="ticker">{selected?.symbol || "BTC"}</span></h2><p>Price performance · USD</p></div></div>
        <div className="intervals" aria-label="Chart period">{Object.keys(time_intervals).map(interval => <button key={interval} aria-pressed={interval === ctx.interval} className={interval === ctx.interval ? "active" : ""} onClick={() => ctx.getHistory(ctx.selected_id, interval)}>{interval}</button>)}</div>
      </div>
      <div className="chart-price"><strong>{money(selected?.priceUsd)}</strong><span className={`change-badge ${selected?.changePercent24Hr >= 0 ? "positive" : "negative"}`}>{percent(selected?.changePercent24Hr)}</span><span className="muted">past 24h</span></div>
      {ctx.stale && <p className="notice">Showing saved chart data.</p>}
      <RequestStatus status={ctx.status} empty={!ctx.history.length} label="price history" onRetry={() => ctx.getHistory(ctx.selected_id, ctx.interval)}/>
      {ctx.status === "ready" && ctx.history.length > 0 && <Graph data={ctx.history.map(item => item.priceUsd)} labels={labels} selectedCurrency={selected}/>}
      <div className="chart-footer"><span><span className="status-dot"/> CoinGecko price data</span><span>24h low <b>{money(selected?.low24h)}</b></span><span>24h high <b>{money(selected?.high24h)}</b></span></div>
    </section>
    <section className="panel markets-panel" aria-label="Cryptocurrency markets">
      <div className="section-heading"><div><h2>Explore the market</h2><p>Your next insight starts here.</p></div><label className="search-field"><Icon name="search" size={18}/><input aria-label="Search coins" placeholder="Search coins…" value={search} onChange={event => setSearch(event.target.value)}/>{search && <button aria-label="Clear search" onClick={() => setSearch("")}>×</button>}</label></div>
      <div className="market-tabs"><button className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>All assets <span>{list.currencyList.length}</span></button><button className={tab === "watch" ? "active" : ""} onClick={() => setTab("watch")}><Icon name="star" size={14}/> Watchlist <span>{watchlist.length}</span></button></div>
      <RequestStatus status={list.assetsStatus} label="assets" onRetry={list.getCurrencyList}/>
      <CurrencyInfo search={search} onlyWatchlist={tab === "watch"} watchlist={watchlist} toggleWatch={toggleWatch}/>
    </section>
    <footer className="page-footer"><span>Stay curious. Stay informed.</span><span>Prices are indicative and may be delayed.</span></footer>
  </main>;
}
