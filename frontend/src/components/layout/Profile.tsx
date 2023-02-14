import {Box} from "@mui/system";
import {Outlet} from "react-router-dom";
import {getUserInfoQuery} from "@recoils/api/User";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";

export function UserInfo(userid: number) {
  const {isLoading, isError, data, error} = getUserInfoQuery(userid);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  return data;
}

export function MyImage() {
  return (
    <Box>
      <Box
        style={{width: 130, height: 130}}
        component="img"
        src={
          "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20150403_67%2Fe2voo_14280514292377Sadp_JPEG%2Fkakako-03.jpg&type=a340"
        }
      />
      <Outlet />
    </Box>
  );
}

export function MyName(userid: number) {
  const myData = UserInfo(userid);
  console.log("myData >>", myData);
  if (myData) {
    return myData.nickname;
  } else {
    return;
  }
}

export function MyMajor() {
  const myData = UserInfo(11);
  if (myData) {
    return myData.campus && myData.campus[0].major;
  } else {
    return;
  }
}

export function MySid() {
  const myData = UserInfo(11);
  if (myData) {
    return myData.campus && myData.campus[0].sid;
  } else {
    return "";
  }
}

export function MyGender() {
  const myData = UserInfo(11);
  if (myData) {
    const myGender = myData.gender;
    if (myGender === "male") {
      return <Box>남</Box>;
    } else if (myGender === "female") {
      return <Box>여</Box>;
    } else {
      return <Box></Box>;
    }
  } else {
    return "";
  }
}

export function MyId() {
  const myData = UserInfo(11);
  //TODO: 토큰에서 추출한 값으로 대체
  if (myData) {
    return myData.userid;
  } else {
    return "";
  }
}
