import {atom, selector} from "recoil";
import {axiosProcess, server} from "@recoils/consonants";
export const userSelector = selector({
  key: "userSelector",
  get: async ({get}) => {
    const user = get(userState);
    return await axiosProcess(
      async () => {
        const {data} = await server.get("/auth/user");
        return data;
      },
      user ? true : false,
    );
  },
});
export const userState = atom({
  key: "userState",
  default: null,
});
