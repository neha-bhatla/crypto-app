import { Link } from "react-router-dom";


const SideNavigation = () => {
   return (
       <aside className="sidenav">
           <div className="logo">
               <h2>CoinHub<i class="fa-brands fa-bitcoin"></i></h2>
           </div>
           <Link to="/">
               Dashboard
           </Link>
           <Link to="/exchanges">
               Exchanges
           </Link>
           <Link to="/converter">
            Converter
           </Link>
       </aside>
    );
}
export default SideNavigation;

