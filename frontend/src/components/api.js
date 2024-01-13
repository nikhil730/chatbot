import axios from "axios";
const api = axios.create({
  baseURL: "https://chatbotbackend-u7qu.onrender.com",
});
export default api;
