import { SelectedCurrencyProvider } from "./Currency_Context";
import { CurrencyListProvider } from "./List_Context";


export default function Store(props) {
   return (
       <CurrencyListProvider>
           <SelectedCurrencyProvider>
               {props.children}
           </SelectedCurrencyProvider>
       </CurrencyListProvider>
   )
}
