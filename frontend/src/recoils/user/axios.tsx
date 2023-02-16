import {api, axiosProcess, server} from "@recoils/constants";
import {postUser} from "@recoils/types";

export function postUserRegistAxios(userInfo: postUser) {
  return api.post("/user", userInfo);
}
export async function editUser(userid: number, userInfo: any) {
  return await axiosProcess(async () => await api.put(`/user/${userid}`, userInfo), true);
}
export const getAuthUser = () => server.get("/auth/user");
export const postLogout = () => server.post("/auth/logout");
export const removeUser = (userid: number) => api.delete(`/user/${userid}`);

export function postSoon(soonInfo: {sjid: number; swid: number; kind: string; progress: string; historydate: Date; contents: string; prays: null}) {
  return api.post("/soon/history/", soonInfo);
}
