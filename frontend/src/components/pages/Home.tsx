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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonIcon from "@mui/icons-material/Person";
import NoData from "@common/NoData";

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
        <RightPanel data={loginUser} campus={selectCampus} myCampus={campus} setOpen={setOpen} />
        <CampusDialog open={open} setOpen={setOpen} items={campusList} campusSelected={campus} handleCampus={handleCampus} />
        <MoveHistory navigate={navigate} />
      </Box>
    </>
  );
}

type Soon = {
  soonid: number;
  sjid: string;
  swid: string;
  createdate: Date;
  soonjang: {
    userid: string;
    nickname: string;
    status: string;
    gender: string;
    refresh_token: string;
    createdate: Date;
    campus: {
      campusid: string;
      userid: string;
      major: string;
      sid: string;
      defaultyn: string;
      createdate: Date;
      updatedate: Date;
      campus: {areaid: string; campusid: string; name: string; useyn: string; createdate: Date};
    };
  };
  soonwon: {
    userid: string;
    nickname: string;
    status: string;
    gender: string;
    refresh_token: string;
    createdate: Date;
    campus: {
      campusid: string;
      userid: string;
      major: string;
      sid: string;
      defaultyn: string;
      createdate: Date;
      updatedate: Date;
      campus: {areaid: string; campusid: string; name: string; useyn: string; createdate: Date};
    };
  };
};

function MySoon({userid}: any) {
  const {isLoading, isError, data, error, refetch} = getSoonListQuery(userid);
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [userid, data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  console.log("data >> ", data);
  const handleClick = (swid: number) => {
    navigate(`soon/card/${swid}`);
  };
  if (data?.length == 0) {
    return <NoData height={"140px"} />;
  }
  return (
    <Box sx={{width: "100%", margin: "0 auto"}}>
      <Box sx={{">div": {background: "#F7F9FA", padding: "10px 20px", fontWeight: "700"}}}>
        <Box>나의 순원</Box>
      </Box>
      <Box sx={{padding: "0 20px", marginTop: "25px"}}>
        <Box
          sx={{
            width: "100%",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(calc(90% / 3),1fr))",
            gridGap: "10px",
          }}>
          {data?.map(({soonwon}: any) => {
            return (
              <Box
                key={soonwon?.userid}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "20px 0",
                  borderRadius: "5px",
                  background: "rgba(41, 41, 41, 0.15)",
                  cursor: "pointer",
                }}
                onClick={() => handleClick(soonwon?.userid)}>
                <PersonIcon sx={{width: 80, heigth: 80}} />
                {soonwon?.nickname}
              </Box>
            );
          })}
        </Box>
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
function RightPanel({data, campus, myCampus, setOpen}: any) {
  const navigate = useNavigate();

  return (
    <Box sx={{width: "100%", display: "flex", alignItems: "center", flexDirection: "column"}}>
      <Box sx={{display: "flex", width: "calc(100% - 40px)", fontSize: "20px", background: "#292929", padding: "20px"}}>
        <MyImage userid={data?.userid} />
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
          <Box sx={{display: "flex"}}>
            <Box sx={{fontWeight: "700", fontSize: "24px", lineHeight: "24px", color: "#FFF"}}>{data?.nickname}</Box>
            <Box
              sx={{cursor: "pointer", color: "#FFF", display: "flex", alignItems: "flex-end", marginLeft: "4px"}}
              onClick={() => navigate(`/myprofile`)}>
              <SettingsIcon sx={{width: 20, height: 20}} />
            </Box>
          </Box>
          <Box sx={{color: "#FFF", fontSize: "15px"}}>
            <Box
              sx={{padding: "7px 0", margin: "0 auto", width: "100%", color: "#FFF", fontSize: "15px", display: "flex", alignItems: "flex-end"}}
              onClick={() => setOpen(true)}>
              {myCampus?.name}
              <KeyboardArrowDownIcon sx={{width: 20, height: 20}} />
            </Box>
          </Box>
        </Box>
      </Box>
      <MySoon userid={data?.userid} />
    </Box>
  );
}

function MyImage({userid}: any) {
  const navigate = useNavigate();
  return (
    // <Box
    //   style={{width: "100%"}}
    //   component="img"
    //   src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20150403_67%2Fe2voo_14280514292377Sadp_JPEG%2Fkakako-03.jpg&type=a340"
    //   onClick={() => navigate(`/soon/card/${userid}`)}
    // />
    <AccountCircleIcon sx={{color: "#FFF", width: 80, height: 80}} onClick={() => navigate(`/soon/card/${userid}`)} />
  );
}

function MoveHistory({navigate}: any) {
  return (
    <Box sx={{position: "absolute", bottom: "20px", right: "20px"}} onClick={() => navigate("/history")}>
      <AddCircleIcon sx={{color: "#292929", borderRadius: "50%", cursor: "pointer", width: "56px", height: "56px"}} />
    </Box>
  );
}
