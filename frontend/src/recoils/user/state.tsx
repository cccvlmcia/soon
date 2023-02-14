import {atom, AtomEffect} from "recoil";
import {getStorage, setStorage} from "utils/SecureStorage";

const localStorageEffect =
  (key: string) =>
  ({setSelf, onSet}: any) => {
    const savedValue = getStorage(key);
    if (savedValue !== null) {
      setSelf(savedValue);
    }
    onSet((newValue: any, _: any, isReset: boolean) => {
      console.log("new Value : ", newValue);
      setStorage(key, JSON.stringify(newValue));
      console.log("newvalue, isReset : ", newValue, isReset);
    });
  };
export const userState = atom({
  key: "userState",
  default: getStorage("#user") || null,
  effects: [localStorageEffect("#user")],
});
