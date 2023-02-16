import {atom} from "recoil";

export const authState = atom({
  key: "authState",
  default: [
    {name: "순코디", id: "SOON"},
    {name: "관리자", id: "ADMIN"},
  ],
});
