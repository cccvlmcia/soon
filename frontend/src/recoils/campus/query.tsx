import {options} from "@recoils/constants";
import {useQuery} from "react-query";
import {getCampusList, getCampusUser, getCampusUserByUserId} from "./axios";

export const getCampusListQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getCampusList", getCampusList, options);
  return {isLoading, isError, data: data?.data, error};
};

export const getCampusUserQuery = (campusid: string) => {
  const {isLoading, isError, data, error, refetch} = useQuery("getCampusUser", () => getCampusUser(campusid), options);
  return {isLoading, isError, data: data?.data, error, refetch};
};

export const getCampusUserByUserIdQuery = (userid: string) => {
  const {isLoading, isError, data, error, refetch} = useQuery("getCampusUserByUserId", () => getCampusUserByUserId(userid), options);
  return {isLoading, isError, data: data?.data, error, refetch};
};
