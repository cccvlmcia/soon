import {options} from "@recoils/consonants";
import {useQuery} from "react-query";
import {getAuthUser} from "./axios";

export const getAuthUserQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getAuthUser", () => getAuthUser(), options);
  return {isLoading, isError, data: data?.data, error};
};
