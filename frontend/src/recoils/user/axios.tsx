import {api, axiosProcess, server} from "@recoils/constants";
import {postUser} from "@recoils/types";

export const postLogout = () => server.post("/auth/logout");
export const removeUser = (userid: number) => api.delete(`/user/${userid}`);

export const getUserList = () => api.get("/user");
export const getUserInfo = (userid: number) => api.get(`/user/${userid}`);

export function postUserRegistAxios(userInfo: postUser) {
  return api.post("/user", userInfo);
}
export async function editUser(userid: number, userInfo: any) {
  return await axiosProcess(async () => await api.put(`/user/${userid}`, userInfo), true);
}
export async function addUserCampus(userid: number, userCampus: any) {
  return await axiosProcess(async () => await api.post(`/user/${userid}/campus`, userCampus), true);
}

export async function postSoon(soonInfo: {
  sjid: number;
  swid: number;
  kind: string;
  progress: string;
  historydate: Date;
  contents: string;
  prays: null;
}) {
  return await axiosProcess(async () => api.post("/soon/history", soonInfo), true);
}
export async function postUserAuth(userid: number, authinfo: {authid: string; campusid: string}) {
  return await axiosProcess(() => api.post(`/user/${userid}/auth`, authinfo), true);
}

export async function getAuthUser() {
  return axiosProcess(() => server.get(`/auth/user`), false).catch(err => null);
}
