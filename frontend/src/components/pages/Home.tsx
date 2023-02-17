import {useEffect, useState} from "react";
import {Box, Button, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";
import {getSoonListQuery} from "@recoils/soon/query";
import {useRecoilState, useRecoilValue} from "recoil";
import {userState} from "@recoils/user/state";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CampusDialog from "./MyProfile/modal/CampusDialog";
import {selectedCampusState} from "@recoils/campus/state";
export default function Home() {
  const loginUser: any = useRecoilValue(userState);
  const [campusList, setCampusList] = useState([]);
  const [campus, setCampus]: any = useRecoilState(selectedCampusState);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const list = loginUser?.campus?.map(({campus}: any) => campus);
    setCampusList(list);
    if (campus == null && list?.length > 0) {
      setCampus(list[0]);
    }
  }, [loginUser]);
  const handleCampus = (campus: any) => {
    setCampus(campus);
  };

  const selectCampus = loginUser?.campus?.find((cam: any) => cam?.campus?.campusid == campus?.campusid);
  return (
    <>
      <Box>
        <Box sx={{textAlign: "center"}}>
          <Button fullWidth variant="outlined" onClick={() => setOpen(true)}>
            {campus?.name}
          </Button>
        </Box>
        <CampusDialog open={open} setOpen={setOpen} items={campusList} campusSelected={campus} handleCampus={handleCampus} />

        <RightPanel data={loginUser} campus={selectCampus} />
        <MoveHistory navigate={navigate} />
      </Box>
    </>
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
    <Box sx={{width: "90%", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gridGap: "10px"}}>
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
function RightPanel({data, campus}: any) {
  const navigate = useNavigate();

  return (
    <Box sx={{width: "100%", display: "flex", alignItems: "center", flexDirection: "column", fontSize: "20px", marginTop: "5px;"}}>
      <Box sx={{display: "flex", justifyContent: "center", flexDirection: "column", maxWidth: "400px"}}>
        <MyImage userid={data?.userid} />
      </Box>
      <Stack direction="row" spacing={1}>
        <Box>{data?.nickname}</Box>
        <Box sx={{cursor: "pointer"}} onClick={() => navigate(`/myprofile/${data?.userid}`)}>
          ⚙️
        </Box>
      </Stack>
      {/* 캠퍼스 변경시.... */}
      <Box>
        {campus?.major}({campus?.sid})
      </Box>
      <Box component={"h2"}>나의 순원</Box>
      <MySoon userid={data?.userid} />
    </Box>
  );
}

function MyImage({userid}: any) {
  const navigate = useNavigate();

  return (
    <Box
      style={{width: "100%"}}
      component="img"
      src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20150403_67%2Fe2voo_14280514292377Sadp_JPEG%2Fkakako-03.jpg&type=a340"
      onClick={() => navigate(`/soon/${userid}/card?id=${userid}`)}
    />
  );
}

function MoveHistory({navigate}: any) {
  return (
    <Box sx={{position: "absolute", bottom: "20px", right: "20px"}} onClick={() => navigate("/history")}>
      <AddCircleIcon sx={{color: "#000000", borderRadius: "50%", cursor: "pointer", width: "56px", height: "56px"}} />
    </Box>
  );
}
