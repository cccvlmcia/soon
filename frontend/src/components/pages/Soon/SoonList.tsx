import {useState, useEffect} from "react";
import {useRecoilValue} from "recoil";

import {Box} from "@mui/material";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";
import {UserCard} from "@layout/Card";
import {getSoonListQuery} from "@recoils/soon/query";
import {userState} from "@recoils/user/state";
import NoData from "@common/NoData";

export default function SoonList() {
  const loginUser: any = useRecoilValue(userState);
  const [soonlist, setSoonlist] = useState([]);
  const {isLoading, isError, data, error, refetch} = getSoonListQuery(loginUser?.userid);
  useEffect(() => {
    if (data) {
      setSoonlist(data);
      refetch();
    }
  }, [loginUser, data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  if (data?.length == 0) {
    return <NoData height={"140px"} />;
  }

  return (
    <>
      <Box sx={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gridGap: "12px", marginTop: "10px"}}>
        {soonlist?.map(({soonid, soonwon}: any) => {
          const campus = soonwon?.campus?.length > 0 ? soonwon?.campus[0] : undefined;
          const sid = campus?.sid;
          const major = campus?.major;
          return <UserCard key={soonid} userid={soonwon.userid} nickname={soonwon.nickname} campus={campus} sid={sid} major={major} />;
        })}
      </Box>
    </>
  );
}
