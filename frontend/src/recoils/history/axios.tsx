import {api, axiosProcess} from "@recoils/constants";

export async function postSoonHistory(params: any) {
  return await axiosProcess(async () => {
    return await api.post(`/soon/history`, params);
  });
}
export async function putSoonHistory(historyid: any, params: any) {
  return await axiosProcess(async () => {
    return await api.put(`soon/history/${historyid}`, params);
  });
}
export async function deleteSoonPray(prayid: any) {
  return await axiosProcess(async () => {
    return await api.delete(`/soon/pray/${prayid}`);
  });
}
