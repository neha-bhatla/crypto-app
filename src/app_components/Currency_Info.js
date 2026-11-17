import React, { useContext } from "react";
import ListContext from "../app_store/List_Context";
import CurrencyContext from "../app_store/Currency_Context";


function CurrencyInfo() {
   const { currencyList } = useContext(
       ListContext
   );
   const { getHistory } = useContext(
       CurrencyContext
   );
   return (
       <ul className="currency_table">
           <li className="header">
               <h4>Name</h4>
               <h4>Price</h4>
               <h4>Changes(24Hr)</h4>
           </li>
           {currencyList
               .slice(0, 5)
               .map((currency) => (
                   <li
                       key={currency.id}
                       className="row"
                       onClick={() =>
                           getHistory(
                               currency.id
                           )
                       }>
                       <span>
                           {currency.name}
                       </span>
                       <span>
                           $
                           {Math.round(
                               currency.priceUsd *
                                   100
                           ) / 100}
                       </span>
                       <span
                           style={{
                               color:
                                   currency.changePercent24Hr >=
                                   0
                                       ? "#56e372"
                                       : "#e65c5c",
                           }}>
                           {Math.round(
                               currency.changePercent24Hr *
                                   100
                           ) / 100}
                           %
                       </span>
                   </li>
               ))}
       </ul>
   );
}


export default CurrencyInfo;
