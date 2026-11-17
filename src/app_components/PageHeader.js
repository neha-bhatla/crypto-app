import { useContext } from "react";
import ListContext from "../app_store/List_Context";
import Icon from "./Icon";

export default function PageHeader({ title, description }) {
  const { getCurrencyList, assetsStatus, updatedAt, stale } = useContext(ListContext);
  return <header className="page-header"><div><p className="eyebrow">YOUR MARKET, AT A GLANCE</p><h1>{title}</h1><p className="subtitle">{description}</p></div>
    <div className="header-actions"><span className={`data-status ${stale ? "is-stale" : ""}`}><span className="status-dot"/>{stale ? "Saved prices" : updatedAt ? `Updated ${new Date(updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Connecting"}</span>
      <button className="icon-button" aria-label="Refresh market prices" title="Refresh market prices (cached for 60 seconds)" disabled={assetsStatus === "loading"} onClick={getCurrencyList}><Icon name="refresh"/></button></div>
  </header>;
}
