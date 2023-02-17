import {useState, useEffect} from "react";
import {useRecoilValue} from "recoil";

import {Box, Stack} from "@mui/material";
import {Button, TextField} from "@mui/material";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";
import {UserCard} from "@layout/Card";
import {api} from "@recoils/constants";
import {getSoonListQuery} from "@recoils/soon/query";
import {userState} from "@recoils/user/state";
import {styles} from "@layout/styles";

export default function SoonList() {
  const loginUser: any = useRecoilValue(userState);
  const [soonlist, setSoonlist] = useState([]);
  const {isLoading, isError, data, error} = getSoonListQuery(loginUser?.userid);
  useEffect(() => {
    if (data) {
      setSoonlist(data);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  return (
    <>
      <Box sx={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gridGap: "12px", marginTop: "10px"}}>
        {soonlist?.map(({soonid, soonwon}: any) => (
          <UserCard key={soonid} userid={soonwon.userid} nickname={soonwon.nickname} />
        ))}
      </Box>
      {/*FIXME: 순원 추가/삭제는 관리자 권한! */}
    </>
  );
}
