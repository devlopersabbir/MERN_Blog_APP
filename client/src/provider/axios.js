import axios from "axios";

export const baseURL = "http://localhost:3000/api";

const token = JSON.parse(localStorage.getItem("token"));

export const apiRequest = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token ?? ""}`,
  },
});
