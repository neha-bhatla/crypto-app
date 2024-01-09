import { useState, useContext } from "react";
import Currency_Context, {
   time_intervals,
} from "../app_store/Currency_Context";
import List_Context from "../app_store/List_Context";
import Graph from "../app_components/Graph";
import Currency_Info from "../app_components/Currency_Info";



const timeFormatOptions = {
   hour: "2-digit",
   minute: "2-digit",
};


const longDateOptions = {
   day: "numeric",
   month: "long",
};


const shortDateOptions = {
   year: "numeric",
   month: "short",
   day: "numeric",
};


const Dash = () => {
   const ctx = useContext(
       Currency_Context
   );
   const currencies = useContext(
       List_Context
   ).currencyList;
   const [searchPhrase, setSearch] =
       useState("");
   const [suggestions, setSuggestions] =
       useState([]);


   const ChangeInSearch = (event) => {
       setSearch(event.target.value);
       let same = currencies.filter(
           (currency) =>
               currency.name
                   .toLowerCase()
                   .includes(
                       event.target.value.toLowerCase()
                   )
       );


       if (
           same.length > 5 &&
           event.target.value !== ""
       ) {
           same = same.slice(0, 5);
       } else if (event.target.value === "") {
           same = [];
       }


       setSuggestions(same);
   };


   const selectedSearchedCurrency = (
       currencyId
   ) => {
       ctx.getHistory(currencyId);
       setSearch("");
       setSuggestions([]);
   };


   const createLabels = () => {
       console.log(ctx.interval);
       let options =
           ctx.interval === "1D"
               ? timeFormatOptions
               : longDateOptions;
       options = ["6M", "1Y"].includes(
           ctx.interval
       )
           ? shortDateOptions
           : options;
       return ctx.history.map((item) => {
           const date = new Date(item.date);
           return date.toLocaleString(
               "en-US",
               options
           );
       });
   };


   return (
       <main className="main">
           <section>
               <div className="search-box">
                   <input
                       type="text"
                       placeholder="search for a coin!..."
                       value={searchPhrase}
                       onChange={ChangeInSearch}
                   />
                   {suggestions.length > 0 && (
                       <ul className="suggestion-box">
                           {suggestions.map(
                               (currency) => (
                                   <li
                                       key={
                                           currency.id
                                       }
                                       onClick={() =>
                                           selectedSearchedCurrency(
                                               currency.id
                                           )
                                       }>
                                       {
                                           currency.name
                                       }
                                   </li>
                               )
                           )}
                       </ul>
                   )}
               </div>
           </section>
           <section>
               <div className="intervals">
                   {Object.keys(time_intervals).map(
                       (interval) => (
                           <button
                               className={`interval-btn ${
                                   interval ===
                                       ctx.interval &&
                                   "active"
                               }`}
                               onClick={() => {
                                   ctx.getHistory(
                                       ctx.selected_id,
                                       interval
                                   );
                               }}
                               key={interval}>
                               {interval}
                           </button>
                       )
                   )}
               </div>
               <Graph
                   data={ctx.history.map(
                       (item) => item.priceUsd
                   )}
                   labels={createLabels()}
                   selectedCurrency={currencies.find(
                       (currency) =>
                           currency.id ===
                           ctx.selected_id
                   )}
               />
           </section>
           <section>
               <div className="title">
                   <h4>Top assets</h4>
               </div>
               <Currency_Info />
           </section>
       </main>
   );
};


export default Dash;
