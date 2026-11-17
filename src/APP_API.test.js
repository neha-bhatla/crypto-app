import APP_API, { normalizeAsset, normalizeExchange } from "./APP_API";

beforeEach(() => { localStorage.clear(); global.fetch = jest.fn(); });
afterEach(() => { jest.restoreAllMocks(); });

const market = [{ id: "bitcoin", name: "Bitcoin", symbol: "btc", current_price: 50000, market_cap_rank: 1 }];
function respond(data) { global.fetch.mockResolvedValue({ ok: true, json: async () => data }); }

test("normalizes provider fields without inventing missing values", () => {
  expect(normalizeAsset(market[0])).toMatchObject({ id: "bitcoin", symbol: "BTC", priceUsd: 50000 });
  expect(normalizeAsset(market[0]).changePercent24Hr).toBeUndefined();
  expect(normalizeExchange({ id: "test", trade_volume_24h_btc: 123 })).toMatchObject({ exchangeId: "test", volumeBtc: 123 });
});

test("caches market data to avoid duplicate network requests", async () => {
  respond(market);
  const result = await APP_API.get("/assets");
  expect(result.data.data[0].priceUsd).toBe(50000);
  await APP_API.get("/assets");
  expect(fetch).toHaveBeenCalledTimes(1);
});

test("returns explicitly stale cached data during an outage", async () => {
  respond(market);
  await APP_API.get("/assets");
  jest.spyOn(Date, "now").mockReturnValue(Date.now() + 120000);
  fetch.mockRejectedValue(new Error("offline"));
  const result = await APP_API.get("/assets");
  expect(result.stale).toBe(true);
  expect(result.data.data[0].id).toBe("bitcoin");
});

test("maps chart timestamps and rejects failed requests without cache", async () => {
  respond({ prices: [[1700000000000, 50000]] });
  const result = await APP_API.get("/assets/bitcoin/history?start=0&end=86400000");
  expect(result.data.data[0]).toMatchObject({ time: 1700000000000, priceUsd: 50000 });
  fetch.mockResolvedValue({ ok: false, status: 429 });
  await expect(APP_API.get("/exchanges")).rejects.toThrow("Rate limit");
});
