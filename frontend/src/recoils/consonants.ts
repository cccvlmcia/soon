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
// "" null undegined

function isEmpty(str: string) {
  return str == "" || str == undefined || str == null;
}

export async function axiosProcess(caller: Function, isLogin = false) {
  try {
    return await caller();
  } catch (err) {
    console.error("err ... ", err);
    if (isLogin) {
      //refresh token 남아 있으면 갱신?!
      const {data} = await server.post("/auth/refreshToken");
      if (data == "USER_AUTHENTICATED") {
        return await caller();
      }
    }
    //FIXME: alert으로 알려주고 넘어가야하는지 확인
    return null;
  }
}
