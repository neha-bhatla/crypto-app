import { useState, useEffect, useCallback, createContext } from "react";
import APP_API from "../APP_API";

const ListContext = createContext({});

export const CurrencyListProvider = ({ children }) => {
  const [currencyList, setCurrencyList] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [assetsStatus, setAssetsStatus] = useState("loading");
  const [exchangesStatus, setExchangesStatus] = useState("loading");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [stale, setStale] = useState(false);
  const [exchangesStale, setExchangesStale] = useState(false);
  const getCurrencyList = useCallback(async () => {
    setAssetsStatus("loading");
    try {
      const response = await APP_API.get("/assets");
      if (!Array.isArray(response.data.data)) throw new Error("Invalid assets response");
      setCurrencyList(response.data.data);
      setUpdatedAt(response.updatedAt);
      setStale(Boolean(response.stale));
      setAssetsStatus("ready");
    } catch {
      setAssetsStatus("error");
    }
  }, []);
  const getExchanges = useCallback(async () => {
    setExchangesStatus("loading");
    try {
      const response = await APP_API.get("/exchanges");
      if (!Array.isArray(response.data.data)) throw new Error("Invalid exchanges response");
      setExchanges(response.data.data);
      setExchangesStale(Boolean(response.stale));
      setExchangesStatus("ready");
    } catch {
      setExchangesStatus("error");
    }
  }, []);
  useEffect(() => { getCurrencyList(); getExchanges(); }, [getCurrencyList, getExchanges]);
  return <ListContext.Provider value={{ currencyList, exchanges, assetsStatus,
    exchangesStatus, updatedAt, stale, exchangesStale, getCurrencyList, getExchanges }}>{children}</ListContext.Provider>;
};

export default ListContext;
