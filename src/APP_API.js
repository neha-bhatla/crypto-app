import axios from "axios";


const BASE_URL = "https://api.coincap.io/v2";


class APP_API {
   static get = (path) => {
       return axios.get(`${BASE_URL}${path}`);
   };
}


export default APP_API;