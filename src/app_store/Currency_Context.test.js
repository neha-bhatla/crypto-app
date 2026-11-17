import { useContext } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CurrencyContext, { SelectedCurrencyProvider } from "./Currency_Context";
import APP_API from "../APP_API";
jest.mock("../APP_API", () => ({ get: jest.fn() }));

function Consumer() {
  const ctx = useContext(CurrencyContext);
  return <><button onClick={() => ctx.getHistory("ethereum", "1M")}>Ethereum</button>
    <p>{ctx.selected_id}:{ctx.status}:{ctx.history[0]?.priceUsd}</p></>;
}

test("ignores an older chart response after a newer selection finishes", async () => {
  let finishBitcoin;
  APP_API.get.mockImplementation(path => path.includes("bitcoin") ? new Promise(resolve => { finishBitcoin = resolve; })
    : Promise.resolve({ data: { data: [{ priceUsd: 2500 }] } }));
  render(<SelectedCurrencyProvider><Consumer/></SelectedCurrencyProvider>);
  fireEvent.click(screen.getByText("Ethereum"));
  await screen.findByText("ethereum:ready:2500");
  await act(async () => finishBitcoin({ data: { data: [{ priceUsd: 50000 }] } }));
  expect(screen.getByText("ethereum:ready:2500")).toBeTruthy();
});
