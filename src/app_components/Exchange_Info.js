import Icon from "./Icon";
import { number } from "../format";

export default function ExchangeInfo({ rows }) {
  return <div className="table-scroll"><table className="market-table exchange-table"><caption className="sr-only">Exchanges ranked by CoinGecko trust score</caption><thead><tr><th className="rank-cell">#</th><th>Exchange</th><th>Trust score</th><th className="numeric">24h volume (BTC)</th><th className="optional-column">Country</th><th><span className="sr-only">Website</span></th></tr></thead>
    <tbody>{rows.map(row => <tr key={row.exchangeId}><td className="muted rank-cell">{row.rank}</td><td><div className="asset-button"><img className="coin-image" src={row.image} alt="" loading="lazy"/><span><strong>{row.name}</strong><small>{row.yearEstablished ? `Est. ${row.yearEstablished}` : "Exchange"}</small></span></div></td><td><span className={`trust-score ${row.trustScore >= 7 ? "positive" : "neutral"}`}>{row.trustScore ?? "—"}<span> / 10</span></span></td><td className="numeric">{number(row.volumeBtc, true)} <span className="muted">BTC</span></td><td className="optional-column muted">{row.country || "—"}</td><td>{/^https?:\/\//.test(row.url) && <a className="icon-button" href={row.url} target="_blank" rel="noreferrer" aria-label={`Visit ${row.name}`}><Icon name="external" size={16}/></a>}</td></tr>)}</tbody></table></div>;
}
