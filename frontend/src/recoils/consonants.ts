import axios from "axios";
import {getStorage, setStorage} from "utils/SecureStorage";

export const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});
export const server = axios.create({
  baseURL: "/",
  withCredentials: true,
});
