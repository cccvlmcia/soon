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
export const getCampusUserByUserId = async (userid: string) => {
  return axiosProcess(async () => {
    //TODO: api 만들어야함
    return api.get(`/user/${userid}/campus/user`);
  });
};
