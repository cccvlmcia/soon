import {axiosProcess} from "@recoils/consonants";
import {atom, selector} from "recoil";
import {getCampusList} from "./axios";

export const campusState = atom({
  key: "campusState",
  default: selector({
    key: "campusQuery",
    get: async () => {
      return await axiosProcess(async () => {
        const {data} = await getCampusList();
        return data;
      });
    },
  }),
});
