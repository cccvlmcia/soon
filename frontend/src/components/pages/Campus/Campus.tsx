import {Box, Stack} from "@mui/material";
import {getCampusUserQuery, getUserInfoQuery} from "@recoils/api/User";
import Error from "components/Error/Error";
import Loading from "react-loading";
import UserCard from "@layout/Card";


export default function Campus(){
  const campusid = "UNIV001" //TODO: localstorage에서 가져온다. user# 
  const {isLoading, isError, data, error} = getCampusUserQuery(campusid);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  const userList = data?.map((
    {userid,user, campus, major, sid}:any) => <UserCard 
    key={userid} 
    userid={userid} 
    nickname={user?.nickname} 
    campus={campus?.name} 
    major={major} 
    sid={sid}
    />)
  return(
    <Box>
      <Stack direction={"row"}>
        <Box>{userList}</Box>
      </Stack>
    </Box>
  );
}

