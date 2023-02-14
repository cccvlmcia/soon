import {Box, Stack} from "@mui/material";
import {getCampusUserQuery} from "@recoils/api/User";
import Error from "components/Error/Error";
import Loading from "react-loading";
import UserCard from "@layout/Card";
import {useRecoilValue} from "recoil";
import {userState} from "@recoils/User/state";

export default function Campus() {
  const loginUser = useRecoilValue(userState);
  console.log("loginUser >", loginUser);
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
