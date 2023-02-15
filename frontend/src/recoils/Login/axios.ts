import {server} from "@recoils/consonants";

export function getGoogleInfoAxios(code: string) {
  return server.post("/auth/google/callback", {code});
}
