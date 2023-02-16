import {options} from "@recoils/consonants";
import {useQuery} from "react-query";
import {getCampusList, getCampusUser} from "./axios";

export const getCampusListQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getCampusList", getCampusList, options);
  return {isLoading, isError, data: data?.data, error};
};

export const getCampusUserQuery = (campusid: string) => {
  const {isLoading, isError, data, error, refetch} = useQuery("getCampusUser", () => getCampusUser(campusid), options);
  return {isLoading, isError, data: data?.data, error, refetch};
};
