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
export const tokenState = atom({
  key: "tokenState",
  default: isEmpty(getStorage("_token")) ? null : JSON.parse(getStorage("_token")),
  effects: [localStorageEffect("_token")],
});
function isEmpty(str: string) {
  return str == "" || str == undefined || str == null;
}
