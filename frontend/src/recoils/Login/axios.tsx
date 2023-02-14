import {api, server} from "@recoils/consonants";
import {postUser} from "@recoils/types";

export function getGoogleInfoAxios(code: string) {
  return server.post("/auth/google/callback", {code});
}

export function postUserRegistAxios(userInfo: postUser) {
  return api.post("/user", userInfo);
}
