import { useState, createContext } from "react";
import APP_API from "../APP_API";


const List_Context = createContext({});


export const CurrencyListProvider = (props) => {
   const [currencyList, setCurrencyList] =
       useState([]);
   const [exchanges, setExchanges] = useState(
       []
   );


   const getCurrencyList = () => {
       APP_API.get("/assets")
           .then((res) => {
               setCurrencyList(res.data.data);
           })
           .catch((error) => {
               setCurrencyList([]);
               console.log(error);
           });
   };


   const getExchanges = () => {
       APP_API.get("/exchanges")
           .then((res) => {
               setExchanges(res.data.data);
           })
           .catch((error) => {
               setExchanges([]);
               console.log(error);
           });
   };


   const values = {
       currencyList: currencyList,
       exchanges: exchanges,
       getCurrencyList: getCurrencyList,
       getExchanges: getExchanges,
   };


   return (
       <List_Context.Provider
           value={values}>
           {props.children}
       </List_Context.Provider>
   );
};


export default List_Context;