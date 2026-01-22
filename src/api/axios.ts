import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // change when deployed
});

export default api;
