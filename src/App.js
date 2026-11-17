import { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Dash from "./app_pages/Dash";
import Exchanges from "./app_pages/Exchanges";
import SideNavigation from "./app_components/SideNavigation";
import CurrencyConverter from "./app_pages/Currency_Converter";
import "./Style/styles.scss";

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="App">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SideNavigation />
      <div id="main-content" className="content-shell">
      <Routes>
        <Route path="/" element={<Dash />} />
        <Route path="/exchanges" element={<Exchanges />} />
        <Route path="/converter" element={<CurrencyConverter />} />
        <Route path="*" element={<main className="main"><section className="panel not-found"><p className="eyebrow">404</p><h1>Page not found</h1><p>This link doesn’t lead anywhere. Head back to the market overview.</p><Link className="secondary-button" to="/">Back to overview</Link></section></main>} />
      </Routes>
      </div>
    </div>
  );
}
