import {useQuery} from "react-query";
import axios from "axios";
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

const getUserList = () => api.get("/user");
const getUserInfo = (userid: number) => api.get(`/user/${userid}`);
const getCampusList = () => api.get("/campus");
const getCampusUser = (campusid: string) => api.get(`/campus/${campusid}`);

export const getUserListQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getUserList", getUserList, options);
  return {isLoading, isError, data: data?.data, error};
};

//처음 로딩시, 세팅하면 끝!
export const getCampusListQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getCampusList", getCampusList, options);
  return {isLoading, isError, data: data?.data, error};
};

export const getCampusUserQuery = (campusid: string) => {
  const {isLoading, isError, data, error} = useQuery("getCampusUser", () => getCampusUser(campusid), options);
  return {isLoading, isError, data: data?.data, error};
};
