import { NavLink } from "react-router-dom";
import Icon from "./Icon";

export default function SideNavigation() {
  return <aside className="sidenav">
    <NavLink to="/" className="brand" aria-label="CoinHub home"><span className="brand-mark">c<span>↗</span></span><span>coinhub<span className="brand-dot">.</span></span></NavLink>
    <p className="nav-label">WORKSPACE</p>
    <nav aria-label="Main navigation">
      <NavLink to="/" end><Icon name="grid"/><span>Overview</span></NavLink>
      <NavLink to="/exchanges"><Icon name="exchange"/><span>Exchanges</span></NavLink>
      <NavLink to="/converter"><Icon name="convert"/><span>Converter</span></NavLink>
    </nav>
    <div className="sidebar-bottom"><div className="sidebar-note"><span className="status-dot"/> Built for the curious.<p>A clearer view of crypto, one coin at a time.</p></div>
      <a href="https://www.coingecko.com/" target="_blank" rel="noreferrer">Data by CoinGecko <Icon name="external" size={13}/></a><small>Market insights. No trading.</small>
    </div>
  </aside>;
}
