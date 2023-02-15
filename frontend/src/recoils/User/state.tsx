import {atom, selector} from "recoil";
import {server} from "@recoils/consonants";

export const userSelector = selector({
  key: "userSelector",
  get: async () => {
    //FIXME: token으로 사용자 정보 가져오기
    try {
      const {data} = await server.get("/auth/user");
      console.log("data >", data);
      return data;
    } catch (err) {
      console.error(err);
      // 오류내용 보고 , access_token 재발급 / refresh_token 재발급
      return err;
    }
  },
});

export const userState = atom({
  key: "userState",
  // default: userSelector,
  default: null,
});
