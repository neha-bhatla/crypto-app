import { useEffect, useContext, useState } from "react";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Dash from "./app_pages/Dash";
import Exchanges from "./app_pages/Exchanges";
import SideNavigation from "./app_components/SideNavigation";
import Currency_Context from "./app_store/Currency_Context";
import List_Context from "./app_store/List_Context";
import "./Style/styles.scss";
import axios from "axios";
import Currency_Converter from "./app_pages/Currency_Converter";

function App() {
  const selectedCurrencyCTX = useContext(Currency_Context);
  const currencyListCTX = useContext(List_Context);

  useEffect(() => {
    currencyListCTX.getCurrencyList();
    currencyListCTX.getExchanges();
    selectedCurrencyCTX.getHistory("bitcoin");
  }, []);

  const [amount1, setAmount1] = useState(1);
  const [amount2, setAmount2] = useState(1);
  const [currency1, setCurrency1] = useState('USD');
  const [currency2, setCurrency2] = useState('EUR');
  const [rates, setRates] = useState([]);

  useEffect(() => {
    axios.get('http://data.fixer.io/api/latest?access_key=3ba1b18070e481f90fed5b5eef08d83d')
      .then(response => {
        setRates(response.data.rates);
      })
  }, []);

  useEffect(() => {
    if (!!rates) {
      function init() {
        first_amount_change(1);
      }
      init();
    }
  }, [rates]);

  function format(number) {
    return number.toFixed(4);
  }

  function first_amount_change(amount1) {
    setAmount2(format(amount1 * rates[currency2] / rates[currency1]));
    setAmount1(amount1);
  }

  function first_currency_change(currency1) {
    setAmount2(format(amount1 * rates[currency2] / rates[currency1]));
    setCurrency1(currency1);
  }

  function second_amount_change(amount2) {
    setAmount1(format(amount2 * rates[currency1] / rates[currency2]));
    setAmount2(amount2);
  }

  function second_currency_change(currency2) {
    setAmount1(format(amount2 * rates[currency1] / rates[currency2]));
    setCurrency2(currency2);
  }

  return (
    <div className="App">
        <SideNavigation />
        <Routes>
          <Route path="/" element={<Dash />} />
          <Route path="/exchanges" element={<Exchanges />} />
          <Route path="/converter" element={
            <div className="converter-container">
              <h1>Currency Converter</h1>
              <Currency_Converter
                onAmountChange={first_amount_change}
                onCurrencyChange={first_currency_change}
                currencies={Object.keys(rates)}
                amount={amount1}
                currency={currency1}
              />
              <Currency_Converter
                onAmountChange={second_amount_change}
                onCurrencyChange={second_currency_change}
                currencies={Object.keys(rates)}
                amount={amount2}
                currency={currency2}
              />
            </div>
          } />
        </Routes>
      </div>
  );
}

export default App;


