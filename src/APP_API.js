const BASE_URL = "https://api.coingecko.com/api/v3";
const CACHE_PREFIX = "coinhub:v2:";
const pending = new Map();

export function normalizeAsset(asset) {
  return {
    id: asset.id, name: asset.name, symbol: asset.symbol?.toUpperCase(),
    image: asset.image, rank: asset.market_cap_rank,
    priceUsd: asset.current_price, changePercent24Hr: asset.price_change_percentage_24h,
    marketCapUsd: asset.market_cap, volumeUsd: asset.total_volume,
    high24h: asset.high_24h, low24h: asset.low_24h,
    sparkline: asset.sparkline_in_7d?.price || [], updatedAt: asset.last_updated,
  };
}

export function normalizeExchange(exchange) {
  return { exchangeId: exchange.id, name: exchange.name, rank: exchange.trust_score_rank,
    image: exchange.image, trustScore: exchange.trust_score,
    volumeBtc: exchange.trade_volume_24h_btc, country: exchange.country,
    yearEstablished: exchange.year_established, url: exchange.url };
}

function endpoint(path) {
  if (path === "/assets") return { url: "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true", ttl: 60000,
    parse: data => {
      if (!Array.isArray(data)) throw new Error("Invalid market response");
      return data.map(normalizeAsset);
    } };
  if (path === "/exchanges") return { url: "/exchanges?per_page=100&page=1", ttl: 300000,
    parse: data => {
      if (!Array.isArray(data)) throw new Error("Invalid exchanges response");
      return data.map(normalizeExchange);
    } };
  const match = path.match(/^\/assets\/([^/]+)\/history\?(.+)$/);
  if (!match) throw new Error("Unknown market request");
  const params = new URLSearchParams(match[2]);
  const days = Math.max(1, Math.round((Number(params.get("end")) - Number(params.get("start"))) / 86400000));
  return { url: `/coins/${match[1]}/market_chart?vs_currency=usd&days=${days}`, ttl: 300000,
    parse: data => {
      if (!Array.isArray(data.prices)) throw new Error("Invalid chart response");
      return data.prices.filter(point => Number.isFinite(point[0]) && Number.isFinite(point[1]))
        .map(([time, priceUsd]) => ({ time, date: new Date(time).toISOString(), priceUsd }));
    } };
}

function readCache(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value && Array.isArray(value.data) && Number.isFinite(value.updatedAt) ? value : null;
  } catch { return null; }
}

export default class APP_API {
  static async get(path) {
    const { url, ttl, parse } = endpoint(path);
    const key = CACHE_PREFIX + url;
    const cache = readCache(key);
    const wrap = (value, stale = false) => ({ data: { data: value.data }, updatedAt: value.updatedAt, stale });
    if (cache && Date.now() - cache.updatedAt < ttl) return wrap(cache);
    if (pending.has(url)) return pending.get(url);
    const request = (async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(BASE_URL + url, { signal: controller.signal });
        if (!response.ok) throw new Error(response.status === 429 ? "Rate limit reached. Please wait a minute and retry." : "Market data is temporarily unavailable.");
        const value = { data: parse(await response.json()), updatedAt: Date.now() };
        try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage can be unavailable or full. */ }
        return wrap(value);
      } catch (error) {
        if (cache) return wrap(cache, true);
        throw error;
      } finally { clearTimeout(timeout); pending.delete(url); }
    })();
    pending.set(url, request);
    return request;
  }
}
