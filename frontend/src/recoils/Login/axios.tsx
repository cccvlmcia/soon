import Cookies from "js-cookie";
import axios from "axios";
import {api, server} from "../constants";

export const sampleAxios = () => {
  return axios.get("https://dummyjson.com/products/");
};

export function getGoogleInfoAxios(code: string) {
  return server.post("/auth/google/callback", {code});
}
export function postUserRegistAxios(userInfo: {name: string; campus: string; sid: string; major: string; cccYN: string; gender: string}) {
  return api.post("user/", userInfo);
}
