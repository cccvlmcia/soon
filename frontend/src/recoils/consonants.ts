import axios from "axios";

const SERVER = "http://localhost:4000/";
export const api = axios.create({
  baseURL: `${SERVER}api/v1`,
  withCredentials: true,
});
