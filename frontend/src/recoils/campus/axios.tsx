import {api, axiosProcess} from "@recoils/constants";

export const getCampusList = async () => {
  return await axiosProcess(async () => {
    return await api.get("/campus");
  });
};

export const getCampusUser = async (campusid: string) => {
  return axiosProcess(async () => {
    return api.get(`/campus/${campusid}/user`);
  });
};
