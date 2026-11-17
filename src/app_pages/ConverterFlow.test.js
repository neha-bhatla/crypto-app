import { render, screen, fireEvent } from "@testing-library/react";
import CurrencyConverter from "./Currency_Converter";
import ListContext from "../app_store/List_Context";

test("recalculates when the amount or pair changes and when swapping", () => {
  render(<ListContext.Provider value={{ currencyList: [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", priceUsd: 50000 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", priceUsd: 2500 },
  ], assetsStatus: "ready", getCurrencyList: jest.fn() }}><CurrencyConverter/></ListContext.Provider>);
  const result = () => screen.getByLabelText("Converted amount").textContent;
  expect(result()).toBe("50,000");
  fireEvent.change(screen.getByLabelText("Amount to convert"), { target: { value: "2" } });
  expect(result()).toBe("100,000");
  fireEvent.change(screen.getByLabelText("You receive"), { target: { value: "ethereum" } });
  expect(result()).toBe("40");
  fireEvent.click(screen.getByLabelText("Swap currencies"));
  expect(result()).toBe("0.1");
  fireEvent.change(screen.getByLabelText("Amount to convert"), { target: { value: "" } });
  expect(result()).toBe("—");
});
