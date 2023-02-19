import {sampleAxios} from "./axios";
import {useQuery} from "react-query";
import {options} from "@recoils/constants";

export const sampleQuery = () => {
  const {isLoading, isError, data, error} = useQuery("sampleQuery", sampleAxios, options);
  return {isLoading, isError, data: data?.data, error};
};
