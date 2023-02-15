import {api, axiosProcess, server} from "@recoils/consonants";
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
