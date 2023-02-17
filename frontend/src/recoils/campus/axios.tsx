import {api} from "@recoils/constants";

export const getCampusList = () => api.get("/campus");

export const getCampusUser = (campusid: string) => api.get(`/campus/${campusid}/user`);
