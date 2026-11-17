import { useState, useEffect, useRef, useCallback, createContext } from "react";
import APP_API from "../APP_API";

export const time_intervals = { "1D": 1, "1W": 7, "1M": 30, "6M": 180, "1Y": 365 };
const CurrencyContext = createContext({});

export const SelectedCurrencyProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [selectedInterval, setInterval] = useState("1D");
  const [id, setId] = useState("bitcoin");
  const [status, setStatus] = useState("loading");
  const request = useRef(0);
  const getHistory = useCallback(async (assetId, interval = "1D") => {
    if (!assetId || !time_intervals[interval]) return;
    const current = ++request.current;
    setId(assetId);
    setInterval(interval);
    setHistory([]);
    setStatus("loading");
    const end = Date.now();
    const start = end - time_intervals[interval] * 86400000;
    try {
      const response = await APP_API.get(`/assets/${encodeURIComponent(assetId)}/history?interval=${interval === "1D" ? "h2" : "d1"}&start=${start}&end=${end}`);
      if (!Array.isArray(response.data.data)) throw new Error("Invalid history response");
      if (current !== request.current) return;
      setHistory(response.data.data);
      setStatus("ready");
    } catch {
      if (current === request.current) setStatus("error");
    }
  }, []);
  useEffect(() => {
    getHistory("bitcoin");
    const pendingRequest = request;
    return () => { pendingRequest.current++; };
  }, [getHistory]);
  return <CurrencyContext.Provider value={{ history, getHistory, selected_id: id,
    interval: selectedInterval, status }}>{children}</CurrencyContext.Provider>;
};
export default CurrencyContext;
