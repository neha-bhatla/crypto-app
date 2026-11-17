import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useContext } from "react";
import APP_API from "../APP_API";
import ListContext, { CurrencyListProvider } from "./List_Context";

jest.mock("../APP_API", () => ({ get: jest.fn() }));

function Consumer() {
  const ctx = useContext(ListContext);
  return <><p>{ctx.assetsStatus}</p><p>{ctx.currencyList.length} assets</p>
    <button onClick={ctx.getCurrencyList}>Retry</button></>;
}

test("recovers from a failed assets request on retry", async () => {
  APP_API.get.mockImplementation(path => path === "/assets"
    ? Promise.reject(new Error("offline")) : Promise.resolve({ data: { data: [] } }));
  render(<CurrencyListProvider><Consumer /></CurrencyListProvider>);
  await screen.findByText("error");
  APP_API.get.mockResolvedValue({ data: { data: [{ id: "bitcoin" }] } });
  fireEvent.click(screen.getByText("Retry"));
  await waitFor(() => expect(screen.getByText("ready")).toBeTruthy());
  expect(screen.getByText("1 assets")).toBeTruthy();
});
