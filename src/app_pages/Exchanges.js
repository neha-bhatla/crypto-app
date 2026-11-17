import { useContext, useState } from "react";
import ListContext from "../app_store/List_Context";
import ExchangeInfo from "../app_components/Exchange_Info";
import PageHeader from "../app_components/PageHeader";
import RequestStatus from "../app_components/RequestStatus";
import Icon from "../app_components/Icon";
import { number } from "../format";

export default function Exchanges() {
  const { exchanges, exchangesStatus, exchangesStale, getExchanges } = useContext(ListContext);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const filtered = exchanges.filter(row => row.name.toLowerCase().includes(search.trim().toLowerCase()));
  const pageCount = Math.ceil(filtered.length / 10);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  return <main className="main"><PageHeader title="Exchange explorer" description="Discover where the market moves. Compare leading crypto exchanges."/>
    <div className="stats-grid"><div className="stat-card"><span>Exchanges tracked <Icon name="exchange" size={16}/></span><strong>{exchanges.length || "—"}</strong><small>Ranked by CoinGecko trust score</small></div><div className="stat-card"><span>Combined 24h volume</span><strong>{exchanges.length ? number(exchanges.reduce((sum, row) => sum + (row.volumeBtc || 0), 0), true) : "—"} <em>BTC</em></strong><small>Across tracked exchanges</small></div><div className="stat-card"><span>High trust exchanges</span><strong>{exchanges.length ? exchanges.filter(row => row.trustScore >= 8).length : "—"}</strong><small>Trust score of 8 or higher</small></div></div>
    <section className="panel"><div className="section-heading"><div><h2>Leading exchanges</h2><p>Volume, reputation, and a little perspective.</p></div><label className="search-field"><Icon name="search" size={18}/><input aria-label="Search exchanges" onKeyDown={event => { if (event.key === "Escape") { setSearch(""); setPage(0); } }} placeholder="Search exchanges…" value={search} onChange={event => { setSearch(event.target.value); setPage(0); }}/></label></div>
      <div className="exchange-notice"><span>Ranked by trust score · volumes in BTC</span><button className="text-button" onClick={getExchanges} disabled={exchangesStatus === "loading"}><Icon name="refresh" size={14}/> Refresh exchanges</button></div>
      {exchangesStale && <p className="notice">Showing saved exchange data while the provider is unavailable.</p>}
      <RequestStatus status={exchangesStatus} empty={exchangesStatus === "ready" && !filtered.length} label="exchanges" onRetry={getExchanges}/>
      {!!filtered.length && <ExchangeInfo rows={filtered.slice(currentPage * 10, currentPage * 10 + 10)}/>}
      <div className="table-footer"><span>{filtered.length ? `${currentPage * 10 + 1}–${Math.min((currentPage + 1) * 10, filtered.length)} of ${filtered.length} exchanges` : "0 exchanges"}</span><div className="pagination"><button aria-label="Previous exchanges page" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>←</button><span>{pageCount ? currentPage + 1 : 0} / {pageCount}</span><button aria-label="Next exchanges page" disabled={currentPage + 1 >= pageCount} onClick={() => setPage(currentPage + 1)}>→</button></div></div>
    </section><footer className="page-footer">Trust scores reflect CoinGecko’s methodology and are not a guarantee of safety.</footer>
  </main>;
}
