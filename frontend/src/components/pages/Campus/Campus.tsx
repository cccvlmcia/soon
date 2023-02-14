import { Box, Stack } from "@mui/material";
import { getCampusUserQuery, getUserInfoQuery } from "@recoils/api/User";
import Error from "components/Error/Error";
import Loading from "react-loading";

import UserCard from "@layout/Card";

export default function Campus() {
  // csmpudif : #user에 사용자 기본 정보 (USER, auth, campus) campusid
  const campusid ="UNIV001";
  const { isLoading, isError, data, error } = getCampusUserQuery(campusid);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  
  // let campusUser = [];
  // console.log("data >>",data)
  // for(let i = 0; i < data.length; i++){
  //   campusUser.push({
  //     id:data[i]?.userid,
  //     nickname:data[i]?.user?.nickname,
  //     campus:data[i]?.campus?.name,
  //     major : data[i]?.major,
  //     sid :data[i]?.sid
  //   })
  //   // campusUser.push({jsonObj});
  // }
  // console.log("캠퍼스 유저들 >>",campusUser);

  // userid, nickname, pictureUrl, campus, major, sid
  const userList = data?.map(({userid,user, campus, major, sid}:any)=><UserCard key={userid} userid={userid} nickname={user?.nickname} campus={campus?.name} major={major} sid={sid}/>)

  return(
    <Box>
      <Stack direction={"row"}>
        <Box>
          {userList}
        </Box>
      </Stack>
    </Box>
  );
};

