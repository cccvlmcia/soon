import {options} from "@recoils/constants";
import {useQuery} from "react-query";
import {getAuthUser, getUserInfo, getUserList} from "@recoils/user/axios";

export const getUserInfoQuery = (userid: number) => {
  const {isLoading, isError, data, error} = useQuery("getUserInfo", () => getUserInfo(userid), options);
  return {isLoading, isError, data: data?.data, error};
};

export const getUserListQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getUserList", getUserList, options);
  return {isLoading, isError, data: data?.data, error};
};
export const getAuthUserQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getAuthUserQuery", getAuthUser, options);
  return {isLoading, isError, data: data?.data, error};
};
