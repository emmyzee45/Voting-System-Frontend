import axios from "axios";

export default axios.create({
  baseURL: "https://voting-system-backend-deploy.onrender.com",
  withCredentials: true,
});
