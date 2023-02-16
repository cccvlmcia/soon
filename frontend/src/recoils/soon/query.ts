import {useQuery} from "react-query";
import {api, options} from "@recoils/consonants";
import {getSoonHistory, getSoonHistorySJList, getSoonHistorySWList, getSoonId, getSoonInfo, getSoonList} from "./axios";

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
