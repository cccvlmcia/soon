import {atom, AtomEffect} from "recoil";
import {getStorage, setStorage} from "utils/SecureStorage";
import {recoilPersist} from "recoil-persist";
import {localStorageEffect} from "@recoils/consonants";

function isEmpty(str: string) {
  return str == "" || str == undefined || str == null;
}
export const userState = atom({
  key: "userState",
  default: isEmpty(getStorage("#user")) ? null : JSON.parse(getStorage("#user")),
  effects: [localStorageEffect("#user")],
});
