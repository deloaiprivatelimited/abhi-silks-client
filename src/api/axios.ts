import axios from "axios";

const api = axios.create({
  baseURL: "https://api.abhi.deloai.com/api", // change when deployed
});

export default api;
