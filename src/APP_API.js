import axios from "axios";

const client = axios.create({
  baseURL: "https://api.coincap.io/v2",
  timeout: 15000,
});

export default class APP_API {
  static get = path => client.get(path);
}
