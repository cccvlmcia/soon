import {api, server} from "@recoils/consonants";
import {postUser} from "@recoils/types";

export function postUserRegistAxios(userInfo: postUser) {
  return api.post("/user", userInfo);
}
export const getAuthUser = () => server.get("/auth/user");
