import {localStorageEffect} from "@recoils/consonants";
import {atom} from "recoil";
import {recoilPersist} from "recoil-persist";
import {getStorage} from "utils/SecureStorage";
const {persistAtom} = recoilPersist();

export const userGoogleAuthState = atom({
  key: "userGoogleAuthState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
export const loginState = atom({
  key: "loginState",
  default: getStorage("#user") || null,
  effects: [localStorageEffect("#user")],
});
