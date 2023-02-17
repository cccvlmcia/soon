import {api} from "@recoils/constants";

export const getSoonList = (sjid: Number) => api.get(`/soon/sj/${sjid}`);
export const getSoonInfo = (swid: Number) => api.get(`/soon/sj/${swid}`);
export const getSoonId = (sjid: Number, swid: Number) => api.get(`/soon/${sjid}/${swid}`);
export const getSoonHistory = (historyid: Number) => api.get(`/soon/history/${historyid}`);
export const getSoonHistorySWList = (swid: Number) => api.get(`/soon/history/sw/${swid}`);
export const getSoonHistorySJList = (sjid: Number) => api.get(`/soon/history/sj/${sjid}`);
