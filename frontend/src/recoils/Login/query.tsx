import {getGoogleInfoAxios, sampleAxios} from "./axios";
import {useQuery} from "react-query";
const options = {
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

export const sampleQuery = () => {
  const {isLoading, isError, data, error} = useQuery("sampleQuery", sampleAxios, options);
  return {isLoading, isError, data: data?.data, error};
};
