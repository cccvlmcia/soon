import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});
export const server = axios.create({
  baseURL: "http://localhost:4000/",
  withCredentials: true,
});
