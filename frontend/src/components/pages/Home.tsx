import {Box, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";
import {getSoonListQuery} from "@recoils/api/Soon";
import {useRecoilValue} from "recoil";
import {userState} from "@recoils/user/state";

export default function Home() {
  const loginUser = useRecoilValue(userState);
  return (
    <Box>
      <RightPanel data={loginUser} />
    </Box>
  );
}

function MySoon({userid}: any) {
  const {isLoading, isError, data, error} = getSoonListQuery(userid);
  const navigate = useNavigate();
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  const handleClick = (swid: number) => {
    navigate(`soon/${swid}/card`);
  };
  return (
    <Box sx={{width: "90%", margin: "0 auto"}}>
      <Box sx={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gridGap: "10px"}}>
        {data.map(({soonwon}: any) => {
          return (
            <Box
              key={soonwon?.userid}
              sx={{textAlign: "center", padding: "10px 0", background: "#ffeded", cursor: "pointer"}}
              onClick={() => handleClick(soonwon?.userid)}>
              {soonwon?.nickname}
            </Box>
          );
        })}
      </Box>
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
    <Box sx={{width: "100%", display: "flex", alignItems: "center", flexDirection: "column", fontSize: "20px"}}>
      <Box sx={{display: "flex", justifyContent: "center", flexDirection: "column", maxWidth: "400px"}}>
        <MyImage userid={data?.userid}/>
      </Box>
      <Stack direction="row" spacing={1}>
        <Box>{data?.nickname}</Box>
        <Box sx={{cursor: "pointer"}} onClick={() => navigate(`/myprofile/${data?.userid}`)}>
          ⚙️
        </Box>
        <Box>ID={data?.userid}</Box>
      </Stack>
      <Stack direction="row">
        {data?.campus[0]?.major} / {data?.campus[0]?.sid} / {data?.gender}
      </Stack>
      <Box component={"h2"}>나의 순원</Box>
      <MySoon userid={data?.userid} />
    </Box>
  );
}

function MyImage({userid}: any) {
  const navigate = useNavigate();
  return (
    <Box>
      <Box
        style={{width: "100%"}}
        component="img"
        src={
          "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20150403_67%2Fe2voo_14280514292377Sadp_JPEG%2Fkakako-03.jpg&type=a340"
        }
      onClick={() => navigate(`/soon/${userid}/card?id=${userid}`)}/>
    </Box>
  );
}
