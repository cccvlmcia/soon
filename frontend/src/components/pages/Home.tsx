import {Box, Stack} from "@mui/material";
import {MyImage, MyName, MySid, MyMajor, MyGender, MyId} from "@layout/Profile";
import {useNavigate} from "react-router-dom";
import {userState} from "@recoils/user/state";
import {useRecoilValue} from "recoil";

export default function Home() {
  //FIXME: loginUser로 변경
  const loginUser = useRecoilValue(userState);
  //TODO: 회원가입 안되어 있으면 로그인 페이지로 이동 getStorage()
  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Box>{LeftPanel()}</Box>
        <Box>{RightPanel()}</Box>
      </Box>
    </Box>
  );
}

// left panel
function LeftPanel() {
  return (
    <Box fontSize={8}>
      <Box component={"h2"} sx={{height: 2}}>
        샬롬
      </Box>
      <Stack direction="row">
        <Box component={"h2"} sx={{height: 2}}>
          {MyName(1)}
        </Box>
        <Box component={"h2"} sx={{height: 2}}>
          님, 카토니에 오신것을
        </Box>
      </Stack>
      <Box component={"h2"} sx={{height: 40}}>
        환영합니다!
      </Box>
      <Box component={"h3"}>카토니는 순모임 관리 플랫폼입니다.</Box>
      <Box component={"h3"}>순원과의 추억들을 기록해보세요!</Box>
    </Box>
  );
}

// right panel
function RightPanel() {
  return (
    <Box>
      <Box sx={{width: 150}}>{UserInfo()}</Box>
      <Box component={"h2"} fontSize={8}>
        나의 순원
      </Box>
      <Stack direction={"row"} spacing={1}>
        <Box>{MySoon()}</Box>
      </Stack>
    </Box>
  );
}

// userinformation
function UserInfo() {
  const navigate = useNavigate();
  return (
    <Box fontSize={12}>
      <Box>{MyImage()}</Box>
      <Stack direction="row" spacing={1}>
        <Box>
          <Stack direction="row">
            <Box>{MyName(1)}</Box>
            <Box onClick={() => navigate("/myprofile")}>⚙️</Box>
          </Stack>
        </Box>
        <Box>
          <Stack direction="row">
            <Box>ID=</Box>
            <Box>{MyId()}</Box>
          </Stack>
        </Box>
      </Stack>
      <Stack direction="row">
        <Box>{MyMajor()}</Box>
        <Box>/</Box>
        <Box>{MySid()}</Box>
        <Box>/</Box>
        <Box>{MyGender()}</Box>
      </Stack>
    </Box>
  );
}

export function MySoon() {
  const mySoon = ["순원1", "순원2"];
  return (
    <Box>
      <Stack direction={"column"} spacing={1}>
        {mySoon.map((soon, index) => {
          return (
            <Box key={index} bgcolor="pink">
              {soon}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
