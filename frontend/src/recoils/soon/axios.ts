import {api, axiosProcess} from "@recoils/constants";

export const getSoonList = async (sjid: Number) => axiosProcess(() => api.get(`/soon/sj/${sjid}`), true);
export const getSoonInfo = async (swid: Number) => axiosProcess(() => api.get(`/soon/sw/${swid}`), true);
export const getSoonId = async (sjid: Number, swid: Number) => axiosProcess(() => api.get(`/soon/${sjid}/${swid}`), true);
export const getSoonHistory = async (historyid: Number) => axiosProcess(() => api.get(`/soon/history/${historyid}`), true);
export const getSoonHistorySWList = async (swid: Number) => axiosProcess(() => api.get(`/soon/history/sw/${swid}`), true);
export const getSoonHistorySJList = async (sjid: Number) => axiosProcess(() => api.get(`/soon/history/sj/${sjid}`), true);
export const deleteSoon = async (sjid: Number, swid: Number) => axiosProcess(() => api.delete(`/soon/${sjid}/${swid}`), true);
