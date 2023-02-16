import {api} from "@recoils/consonants";

export const getCampusList = () => api.get("/campus");

export const getCampusUser = (campusid: string) => api.get(`/campus/${campusid}/user`);
