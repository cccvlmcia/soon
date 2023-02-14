import {useQuery} from "react-query";
import {api} from "@recoils/consonants";

export const options = {
  refetchOnWindowFocus: false,
  retry: 0,
  onSuccess: ({data}: any) => {
    //api 호출 성공
    console.log("onSuccess >>", data);
  },
  onError: (error: any) => {
    //api 호출 실패
    console.log("onError >> ", error.message);
  },
};
// const SERVER = "http://13.125.79.139/";

const getUserList = () => api.get("/user");
const getUserInfo = (userid: number) => api.get(`/user/${userid}`);
const getCampusList = () => api.get("/campus");
const getCampusUser = (campusid: string) => api.get(`/campus/${campusid}`);

export const getUserListQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getUserList", getUserList, options);

  return {isLoading, isError, data: data?.data, error};
};

export const getCampusListQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getCampusList", getCampusList, options);
  return {isLoading, isError, data: data?.data, error};
};

export const getUserInfoQuery = (userid: number) => {
  const {isLoading, isError, data, error} = useQuery("getUserInfo", () => getUserInfo(userid), options);

  return {isLoading, isError, data: data?.data, error};
};

export const getCampusUserQuery = (campusid: string) => {
  const {isLoading, isError, data, error} = useQuery("getCampusUser", () => getCampusUser(campusid), options);

  return {isLoading, isError, data: data?.data, error};
};
