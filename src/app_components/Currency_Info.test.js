import { render, screen, fireEvent } from "@testing-library/react";
import CurrencyInfo from "./Currency_Info";
import ListContext from "../app_store/List_Context";
import CurrencyContext from "../app_store/Currency_Context";

const assets = Array.from({ length: 12 }, (_, index) => ({
  id: `coin-${index}`, name: `Coin ${index}`, symbol: `C${index}`, rank: index + 1,
  priceUsd: index + 1, changePercent24Hr: 1, marketCapUsd: 1000,
  image: "test.png", sparkline: [1, 2],
}));
function renderTable(props = {}, getHistory = jest.fn()) {
  return render(<ListContext.Provider value={{ currencyList: assets, assetsStatus: "ready" }}>
    <CurrencyContext.Provider value={{ getHistory, selected_id: "coin-0", interval: "1M" }}>
      <CurrencyInfo toggleWatch={jest.fn()} {...props}/>
    </CurrencyContext.Provider>
  </ListContext.Provider>);
}

test("paginates and sorts the complete market list", () => {
  renderTable();
  expect(screen.getByText("1–10 of 12 assets")).toBeTruthy();
  fireEvent.click(screen.getByLabelText("Next assets page"));
  expect(screen.getByText("11–12 of 12 assets")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /Price/ }));
  expect(screen.getByText("1–10 of 12 assets")).toBeTruthy();
  const rows = screen.getAllByRole("row");
  expect(rows[1].textContent).toContain("Coin 11");
});

test("filters by symbol and keeps the chosen interval when selecting a coin", () => {
  const getHistory = jest.fn();
  renderTable({ search: "C10" }, getHistory);
  expect(screen.getByText("1–1 of 1 assets")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Coin 10 C10" }));
  expect(getHistory).toHaveBeenCalledWith("coin-10", "1M");
});

test("shows saved assets and allows removing one", () => {
  const toggleWatch = jest.fn();
  renderTable({ onlyWatchlist: true, watchlist: ["coin-2"], toggleWatch });
  expect(screen.getByText("Coin 2")).toBeTruthy();
  fireEvent.click(screen.getByLabelText("Remove Coin 2 from watchlist"));
  expect(toggleWatch).toHaveBeenCalledWith("coin-2");
  expect(screen.queryByText("Coin 0")).toBeNull();
});
