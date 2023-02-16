import {Box, Stack} from "@mui/material";
import {getCampusUserQuery} from "@recoils/api/User";
import Error from "components/Error/Error";
import Loading from "react-loading";
import {UserCard} from "@layout/Card";
import {useRecoilValue} from "recoil";
import {userState} from "@recoils/user/state";
import {campusState} from "@recoils/campus/state";
export default function Campus() {
  const loginUser: any = useRecoilValue(userState);
  const campusList: any = useRecoilValue(campusState);
  if (loginUser?.campus?.length == 0) {
    // <NoData/> 필요
    return <Box>데이터 없습니다.</Box>;
  }
  const campusid = loginUser?.campus[0]?.campusid || "";
  const campus = campusList?.find((cam: any) => cam?.campusid == campusid);
  //FIXME: 하드코딩된 캠퍼스 수정
  const {isLoading, isError, data, error} = getCampusUserQuery("UNIV102" || campusid);
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
    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <Box component={"h1"}>{campus?.name}</Box>
      <Box sx={{display: "flex", gap: 1, flexFlow: "row wrap", justifyContent: "center"}}>{userList}</Box>
    </Box>
  );
}
