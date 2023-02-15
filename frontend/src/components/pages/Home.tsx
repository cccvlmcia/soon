import {Box, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {getUserInfoQuery} from "@recoils/api/User";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";
import { getSoonListQuery } from "@recoils/api/Soon";

export default function Home() {
  //TODO: 회원가입 안되어 있으면 로그인 페이지로 이동 getStorage()
  const userid = 1;//TODO: #user
  const {isLoading, isError, data, error} = getUserInfoQuery(userid);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Box><LeftPanel data = {data}/></Box>
        <Box><RightPanel data = {data}/></Box>
      </Box>
    </Box>
  );
}

function MySoon({userid}: any) {
  const {isLoading, isError, data, error} = getSoonListQuery(userid)
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  return (
    <Box>
      <Stack direction={"column"} spacing={1}>
        {data.map(({soonwon}:any) => {
          return (
            <Box key="{soonwon}" bgcolor="pink">
              {soonwon.nickname}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

// left panel
function LeftPanel({data}: any) {
  return (
    <Box fontSize={8}>
      <Box component={"h2"} sx={{height: 2}}>
        샬롬
      </Box>
      <Stack direction="row">
        <Box component={"h2"} sx={{height: 2}}>
          {data?.nickname}
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
function RightPanel({data}: any) {
  const navigate = useNavigate();
  return (
    <Box>
      <Box sx={{width: 150}}>
        <Box fontSize={12}>
          <MyImage/>
          <Stack direction="row" spacing={1}>
            <Box>
              <Stack direction="row">
                <Box>{data.nickname}</Box>
                <Box onClick={() => navigate(`/myprofile/${data?.userid}`)}>⚙️</Box>
              </Stack>
            </Box>
            <Box>
              <Stack direction="row">
                <Box>ID=</Box>
                <Box>{data?.userid}</Box>
              </Stack>
            </Box>
          </Stack>
          <Stack direction="row">
            <Box>{data?.campus[0]?.major}</Box>
            <Box>/</Box>
            <Box>{data?.campus[0]?.sid}</Box>
            <Box>/</Box>
            <Box>{data?.gender}</Box>
          </Stack>
        </Box>
      </Box>
      <Box component={"h2"} fontSize={8}>
        나의 순원
      </Box>
      <Stack direction={"row"} spacing={1}>
        <Box><MySoon userid = {data?.userid}/></Box>
      </Stack>
    </Box>
  );
}

function MyImage() {
  return (
    <Box>
      <Box
        style={{width: 130, height: 130}}
        component="img"
        src={
          "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20150403_67%2Fe2voo_14280514292377Sadp_JPEG%2Fkakako-03.jpg&type=a340"
        }
      />
    </Box>
  );
}
