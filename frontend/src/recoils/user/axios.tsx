import {api, server} from "@recoils/consonants";
import {postUser} from "@recoils/types";
import axios from "axios";

export function postUserRegistAxios(userInfo: postUser) {
  return api.post("/user", userInfo);
}
export const getAuthUser = () => server.get("/auth/user");
export const postLogout = () => server.post("/auth/logout");
export const removeUser = (userid: number) => api.delete(`/user/${userid}`);

export function postSoon(soonInfo: {sjid: number; swid: number; kind: string; progress: string; historydate: Date; contents: string; prays: null}) {
  return api.post("/soon/history/", soonInfo);
}
