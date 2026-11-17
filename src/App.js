import { Routes, Route } from "react-router-dom";
import Dash from "./app_pages/Dash";
import Exchanges from "./app_pages/Exchanges";
import SideNavigation from "./app_components/SideNavigation";
import CurrencyConverter from "./app_pages/Currency_Converter";
import "./Style/styles.scss";

export default function App() {
  return (
    <div className="App">
      <SideNavigation />
      <Routes>
        <Route path="/" element={<Dash />} />
        <Route path="/exchanges" element={<Exchanges />} />
        <Route path="/converter" element={<CurrencyConverter />} />
        <Route path="*" element={<main className="main"><section><h1>Page not found</h1></section></main>} />
      </Routes>
    </div>
  );
}
