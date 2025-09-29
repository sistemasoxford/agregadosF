import axios from "axios";

const api = axios.create({
  baseURL: "http://172.17.16.1:4001/auth",
  headers: { "Content-Type": "application/json" },
});

export default api;
