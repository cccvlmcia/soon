import axios from "axios";

const SERVER = "http://localhost:4000/";

// const SERVER = "http://13.125.79.139/";

export const api = axios.create({
  baseURL: `${SERVER}api/v1`,
  withCredentials: true,
});
