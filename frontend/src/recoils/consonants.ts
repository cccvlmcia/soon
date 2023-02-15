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

export async function axiosProcess(caller: Function, isLogin = false) {
  try {
    return await caller();
  } catch (err) {
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
export const options = {
  refetchOnWindowFocus: false,
  retry: 0,
  onSuccess: ({data}: any) => {
    //api 호출 성공
    console.log("onSuccess >>", data);
  },
  onError: (error: any) => {
    //api 호출 실패
    console.log("onError >> ", error.message);
  },
};
