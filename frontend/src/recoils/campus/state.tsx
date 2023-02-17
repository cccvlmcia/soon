import {axiosProcess} from "@recoils/constants";
import {userState} from "@recoils/user/state";
import {atom, selector} from "recoil";
import {getCampusList} from "./axios";

export const campusState = atom({
  key: "campusState",
  default: selector({
    key: "campusQuery",
    get: async ({get}) => {
      const user = get(userState);
      return await axiosProcess(
        async () => {
          const {data} = await getCampusList();
          return data;
        },
        user ? true : false,
      );
    },
  }),
});
export const selectedCampusState = atom({
  key: "selectedCampusState",
  default: null,
});
