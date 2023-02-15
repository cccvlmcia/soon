import {Box, Stack} from "@mui/material";
import {getCampusUserQuery} from "@recoils/api/User";
import Error from "components/Error/Error";
import Loading from "react-loading";
import {UserCard} from "@layout/Card";
import {useRecoilValue} from "recoil";
import {userState} from "@recoils/user/state";

export default function Campus() {
  const loginUser: any = useRecoilValue(userState);
  if (loginUser?.campus?.length == 0) {
    // <NoData/> 필요
    return <Box>데이터 없습니다.</Box>;
  }
  const campusid = loginUser?.campus[0]?.campusid || "";
  const {isLoading, isError, data, error} = getCampusUserQuery(campusid);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  const userList = data?.map(({userid, user, campus, major, sid}: any) => (
    <UserCard key={userid} userid={userid} nickname={user?.nickname} campus={campus?.name} major={major} sid={sid} />
  ));
  return (
    <Box>
      <Box>캠퍼스 목록 select box</Box>
      <Box>{userList}</Box>
    </Box>
  );
}
