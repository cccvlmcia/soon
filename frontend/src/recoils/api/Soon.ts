import {useQuery} from "react-query";
import {api} from "@recoils/constants";

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
const getSoonList = (sjid: Number) => api.get(`/soon/sj/${sjid}`);
const getSoonInfo = (swid: Number) => api.get(`/soon/sj/${swid}`);
const getSoonId = (sjid: Number, swid: Number) => api.get(`/soon/${sjid}/${swid}`);
const getSoonHistory = (historyid: Number) => api.get(`/soon/history/${historyid}`);
const getSoonHistorySWList = (swid: Number) => api.get(`/soon/history/sw/${swid}`);
const getSoonHistorySJList = (sjid: Number) => api.get(`/soon/history/sj/${sjid}`);

export const getSoonListQuery = (sjid: Number) => {
  const {isLoading, isError, data, error} = useQuery("getSoonList", () => getSoonList(sjid), options);
  return {isLoading, isError, data: data?.data, error};
};

export const getSoonInfoQuery = (swid: Number) => {
  const {isLoading, isError, data, error} = useQuery("getSoonInfo", () => getSoonInfo(swid), options);
  return {isLoading, isError, data: data?.data, error};
};

export const getSoonIdQuery = (sjid: Number, swid: Number) => {
  const {isLoading, isError, data, error} = useQuery("getSoonId", () => getSoonId(sjid, swid), options);
  return {isLoading, isError, data: data?.data, error};
};

export const getSoonHistoryQuery = (historyid: Number) => {
  const {isLoading, isError, data, error} = useQuery("getSoonHistory", () => getSoonHistory(historyid), options);
  return {isLoading, isError, data: data?.data, error};
};

export const getSoonHistorySWListQuery = (swid: Number) => {
  const {isLoading, isError, data, error} = useQuery("getSoonHistorySWList", () => getSoonHistorySWList(swid), options);
  return {isLoading, isError, data: data?.data, error};
};

export const getSoonHistorySJListQuery = (sjid: Number) => {
  const {isLoading, isError, data, error} = useQuery("getSoonHistorySJList", () => getSoonHistorySJList(sjid), options);
  return {isLoading, isError, data: data?.data, error};
};
