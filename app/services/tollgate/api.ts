// app/services/tollgate/api.ts
import axios from "axios";

const tollgateApi = axios.create({
  baseURL: "http://172.17.16.1:4003/", // endpoint real de Tollgate
  timeout: 5000,
});

export default tollgateApi;
