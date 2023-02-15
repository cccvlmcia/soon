import {axiosProcess, server} from "@recoils/consonants";

export async function getGoogleInfoAxios(code: string) {
  return axiosProcess(async () => {
    const {data} = await server.post("/auth/google/callback", {code});
    return data;
  });
}
