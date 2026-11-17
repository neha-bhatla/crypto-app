import { useContext, useState } from "react";
import ListContext from "../app_store/List_Context";
import CurrencyContext from "../app_store/Currency_Context";
import Icon from "./Icon";
import Sparkline from "./Sparkline";
import { money, percent } from "../format";

export default function CurrencyInfo({ search = "", onlyWatchlist = false, watchlist = [], toggleWatch }) {
  const { currencyList, assetsStatus } = useContext(ListContext);
  const { getHistory, selected_id: selectedId, interval } = useContext(CurrencyContext);
  const [sort, setSort] = useState({ key: "rank", asc: true });
  const [pageState, setPageState] = useState({ key: "", page: 0 });
  const queryKey = `${search}:${onlyWatchlist}:${watchlist.join(",")}:${sort.key}:${sort.asc}`;
  const filtered = currencyList.filter(asset => (!onlyWatchlist || watchlist.includes(asset.id)) && `${asset.name} ${asset.symbol}`.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => ((a[sort.key] ?? 0) - (b[sort.key] ?? 0)) * (sort.asc ? 1 : -1));
  const pageCount = Math.ceil(filtered.length / 10);
  const page = Math.min(pageState.key === queryKey ? pageState.page : 0, Math.max(0, pageCount - 1));
  const setPage = value => setPageState({ key: queryKey, page: value });
  const sortBy = key => { setSort(previous => ({ key, asc: previous.key === key ? !previous.asc : key === "rank" })); };
  const sortHeader = (key, label, className = "") => <th className={className} aria-sort={sort.key === key ? sort.asc ? "ascending" : "descending" : "none"}><button onClick={() => sortBy(key)}>{label}<span>{sort.key === key ? sort.asc ? " ↑" : " ↓" : " ↕"}</span></button></th>;
  if (!currencyList.length) return null;
  return <><div className="table-scroll"><table className="market-table"><caption className="sr-only">Cryptocurrency prices. Select a coin to update its chart.</caption><thead><tr><th className="watch-cell"><span className="sr-only">Watchlist</span></th>{sortHeader("rank", "#", "rank-cell")}<th>Asset</th>{sortHeader("priceUsd", "Price")}{sortHeader("changePercent24Hr", "24h change")}{sortHeader("marketCapUsd", "Market cap", "optional-column")}<th className="optional-column">Last 7 days</th></tr></thead>
    <tbody>{filtered.slice(page * 10, page * 10 + 10).map(asset => <tr key={asset.id} className={asset.id === selectedId ? "selected-row" : ""}>
      <td className="watch-cell"><button className={`watch-button ${watchlist.includes(asset.id) ? "saved" : ""}`} aria-label={`${watchlist.includes(asset.id) ? "Remove" : "Add"} ${asset.name} ${watchlist.includes(asset.id) ? "from" : "to"} watchlist`} aria-pressed={watchlist.includes(asset.id)} onClick={() => toggleWatch(asset.id)}><Icon name="star" size={16}/></button></td>
      <td className="muted rank-cell">{asset.rank}</td><td><button className="asset-button" onClick={() => { getHistory(asset.id, interval); document.getElementById("price-chart")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} aria-pressed={asset.id === selectedId}><img className="coin-image" src={asset.image} alt="" loading="lazy"/><span><strong>{asset.name}</strong><small>{asset.symbol}</small></span></button></td>
      <td className="numeric">{money(asset.priceUsd)}</td><td className={`numeric ${asset.changePercent24Hr >= 0 ? "positive" : "negative"}`}>{percent(asset.changePercent24Hr)}</td><td className="numeric optional-column">{money(asset.marketCapUsd, true)}</td><td className="optional-column"><Sparkline values={asset.sparkline} positive={asset.sparkline[asset.sparkline.length - 1] >= asset.sparkline[0]}/></td>
    </tr>)}</tbody></table></div>
    {!filtered.length && <div className="request-state">{onlyWatchlist && !watchlist.length ? "Your watchlist is waiting. Tap a star beside a coin to save it." : "No coins found. Try a different name or symbol."}</div>}
    <div className="table-footer"><span>{filtered.length ? `${page * 10 + 1}–${Math.min((page + 1) * 10, filtered.length)} of ${filtered.length} assets` : "0 assets"}{assetsStatus === "loading" ? " · refreshing" : ""}</span><div className="pagination"><button aria-label="Previous assets page" disabled={page === 0} onClick={() => setPage(page - 1)}>←</button><span>{pageCount ? page + 1 : 0} / {pageCount}</span><button aria-label="Next assets page" disabled={page + 1 >= pageCount} onClick={() => setPage(page + 1)}>→</button></div></div>
  </>;
}
