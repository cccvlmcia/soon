import {Box, Stack} from "@mui/material";
import {getCampusUserQuery, getUserInfoQuery} from "@recoils/api/User";
import Error from "components/Error/Error";
import Loading from "react-loading";
import {UserInfo} from "@layout/Profile";
import UserCard from "@layout/Card";

function campusData(campusid: string) {
  const {isLoading, isError, data, error} = getCampusUserQuery(campusid);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  return data;
}

function MyCampusId(userid: number) {
  const myData = UserInfo(userid);
  if (myData) {
    return myData.campus && myData.campus[0].campusid;
  } else {
    return;
  }
}

function CampusUser(userid: number) {
  const campusId = MyCampusId(userid);
  const data = campusData(campusId);
  console.log("campusId>>", campusId);
  console.log("캠퍼스 지체들>>", data);
  return <Box></Box>;
  // const CampusUser = [];
  // for(let count = 0; count<data; count++){
  //   console.log("didididi")
  //   let id = data[count]&&data[count].userid;
  //   let nickname = data[count]&&data[count].user.nickname;
  //   let campus = data[count]&&data[count].campus.name;
  //   let major = data[count]&&data[count].major;
  //   let sid = data[count]&&data[count].sid;
  // };
  // return (
  //   <div>
  //     { CampusUser.map((CampusUser) => (
  //       <UserCard
  //         key={CampusUser.swid}
  //         swid={CampusUser.swid}
  //         nickname={CampusUser.nickname}
  //         pictureUrl="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20150403_67%2Fe2voo_14280514292377Sadp_JPEG%2Fkakako-03.jpg&type=a340"
  //         campus={CampusUser.campus}
  //         major={CampusUser.major}
  //         sid={CampusUser.sid}
  //       />
  //     )) }
  //   </div>
  // );
}

export default function Campus() {
  return (
    <Box>
      <Stack direction={"row"}>
        <Box>{CampusUser(11)}</Box>
      </Stack>
    </Box>
  );
}
