import axios from "axios";
import {getStorage, setStorage} from "utils/SecureStorage";

export const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});
export const server = axios.create({
  baseURL: "http://localhost:4000/",
  withCredentials: true,
});

export const localStorageEffect =
  (key: string) =>
  ({setSelf, onSet}: any) => {
    const savedValue = getStorage(key);
    if (savedValue != "") {
      setSelf(JSON.parse(savedValue));
    }
    onSet((newValue: any, _: any, isReset: boolean) => {
      if (newValue) {
        // console.log("new Value : ", newValue);
        setStorage(key, JSON.stringify(newValue));
        // console.log("newvalue, isReset : ", newValue, isReset);
      }
    });
  };
