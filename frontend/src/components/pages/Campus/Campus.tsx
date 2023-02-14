import {Box, Stack} from "@mui/material";
import {getCampusUserQuery} from "@recoils/api/User";
import Error from "components/Error/Error";
import Loading from "react-loading";

import UserCard from "@layout/Card";

import {useRecoilValue} from "recoil";
import { loginState } from "@recoils/user/state";

export default function Campus() {
  // csmpudif : #user에 사용자 기본 정보 (USER, auth, campus) campusid
  const loginUser = useRecoilValue(loginState);
  //FIXME: loginUser에서 userid, campusid, auth 꺼내야 함.
  const campusid = "UNIV001";
  const {isLoading, isError, data, error} = getCampusUserQuery(campusid);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  const auth: string[] = [];
  const userList = data?.map(({userid, user, campus, major, sid}: any) => (
    <UserCard key={userid} userid={userid} nickname={user?.nickname} campus={campus?.name} major={major} sid={sid} auth={auth} />
  ));

  return (
    <Box>
      <Stack direction={"row"}>
        <Box>{userList}</Box>
      </Stack>
    </Box>
  );
}
