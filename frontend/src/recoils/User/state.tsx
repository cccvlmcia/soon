import {atom, selector} from "recoil";
import {axiosProcess, server} from "@recoils/consonants";
export const userSelector = selector({
  key: "userSelector",
  get: async ({get}) => {
    const user = get(userState);
    //접속중일때, 갱신하는 상황인지, 토큰만료 후 로그인 하는 상황인지 판단
    console.log("user >", user);
    return await axiosProcess(
      async () => {
        const {data} = await server.get("/auth/user");
        return data;
      },
      user ? true : false,
    );
  },
});
// export const userSelector = selector({
//   key: "userSelector",
//   get: async ({get}) => {
//     const user = get(userState);
//     return await axiosProcess(
//       async () => {
//         const {data} = await server.get("/auth/user");
//         return data;
//       },
//       user ? true : false,
//     );
//   },
// });
export const userState = atom({
  key: "userState",
  default: null,
});
