import Cookies from "js-cookie";
import axios from "axios";
import {api} from "@recoils/consonants";

export const sampleAxios = () => {
  return axios.get("https://dummyjson.com/products/");
};

export function getGoogleInfoAxios(code: string) {
  return api.post("/auth/google/callback", {code});
}
export function postUserRegistAxios(userInfo: {name: string; campus: string; sid: string; major: string; cccYN: string; gender: string}) {
  return api.post("/api/v1/user/", userInfo);
}
