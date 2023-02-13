import Cookies from "js-cookie";
import axios from "axios";

export const sampleAxios = () => {
  return axios.get("https://dummyjson.com/products/");
};
