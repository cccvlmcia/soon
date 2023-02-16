import {options} from "@recoils/consonants";
import {useQuery} from "react-query";
import {getUserInfo, getUserList} from "@recoils/user/axios";

export const getUserInfoQuery = (userid: number) => {
  const {isLoading, isError, data, error} = useQuery("getUserInfo", () => getUserInfo(userid), options);
  return {isLoading, isError, data: data?.data, error};
};

export const getUserListQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getUserList", getUserList, options);
  return {isLoading, isError, data: data?.data, error};
};
