import {atom} from "recoil";
import {getStorage} from "utils/SecureStorage";

export const userState = atom({
  key: "userState",
  default: getStorage("#user") || null,
});
