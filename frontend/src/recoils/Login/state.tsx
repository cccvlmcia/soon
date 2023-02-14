import {atom} from "recoil";
import {recoilPersist} from "recoil-persist";
const {persistAtom} = recoilPersist();

export const userGoogleAuthState = atom({
  key: "userGoogleAuthState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
