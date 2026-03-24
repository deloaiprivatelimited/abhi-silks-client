import axios from "axios";

const api = axios.create({
  baseURL: "https://web-production-2d63b.up.railway.app/api", // change when deployed
});

export default api;
