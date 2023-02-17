import {useRecoilValue} from "recoil";
import Loading from "react-loading";
import {Box} from "@mui/material";
import {userState} from "@recoils/user/state";
import {campusState} from "@recoils/campus/state";
import {authState} from "@recoils/auth/state";
import {getCampusUserQuery} from "@recoils/campus/query";
import {UserCard} from "@layout/Card";
import Error from "components/Error/Error";

export default function Campus() {
  const loginUser: any = useRecoilValue(userState);
  const campusList: any = useRecoilValue(campusState);
  const authes = useRecoilValue(authState);

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
  const auth = loginUser?.auth;
  const isAdmin = auth?.filter(({authid}: {authid: string}) => authes?.filter(({id}) => id == authid)?.length > 0)?.length > 0;
  const userList = data?.map(({userid, user, campus, major, sid}: any) => (
    <UserCard
      key={userid}
      userid={userid}
      nickname={user?.nickname}
      campus={campus?.name}
      major={major}
      sid={sid}
      isAdmin={isAdmin}
      authList={user?.auth}
    />
  ));

  return (
    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <Box component={"h1"}>{campus?.name}</Box>
      <Box sx={{display: "flex", gap: 1, flexFlow: "row wrap", justifyContent: "center"}}>{userList}</Box>
    </Box>
  );
}
