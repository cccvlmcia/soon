import {useRef, useState, useEffect} from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import {useRecoilValue} from "recoil";
import {Box, TextField, Button, AppBar, Toolbar, IconButton, Typography} from "@mui/material";

import {addUserCampus} from "@recoils/user/axios";
import {userState} from "@recoils/user/state";
import CampusDialog from "./modal/CampusDialog";
import {useLocation, useNavigate} from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {getTitle} from "@layout/header/HeaderConstants";
import CheckIcon from "@mui/icons-material/Check";
import {getCampusListQuery} from "@recoils/campus/query";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";

type FormData = {
  name: string;
  campusid: string;
  sid: string;
  major: string;
  cccYN: string;
  gender: string;
};
type campusType = {
  campusid: string;
  name: string;
  areaid: string;
  useyn: string;
  createdate: string;
};
//TODO: 캠퍼스 추가는 Register 인가?
export default function AddMyProfile() {
  const ref = useRef(null);
  const {isLoading, isError, data, error} = getCampusListQuery();

  const {register, handleSubmit} = useForm<FormData>();
  const loginUser: any = useRecoilValue(userState);
  const [campusList, setCampusList] = useState([]);
  const [myCampusList]: any = useState(loginUser?.campus);
  const [campusSelected, setCampusSelected]: any = useState();
  const [name] = useState<string>(loginUser?.nickname);
  const [sid, setSid] = useState<string>("");
  const [major, setMajor] = useState<string>("");
  const [open, setOpen]: any = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (campusList?.length == 0 && data?.length > 0) {
      const list = data?.filter(({campusid}: any) => myCampusList?.filter((cam: any) => cam?.campusid == campusid) == 0);
      setCampusList(list);
    }
  }, [data]);

  //FIXME: set 하는 방식을 id > obj로 변경 필요
  const handleCampus = (campus: any) => {
    setCampusSelected(campus);
  };

  const writeRegister: SubmitHandler<FormData> = async (params: FormData) => {
    const userInfo = {
      campusid: campusSelected?.campusid, //FIXME: 단일 선택 문제 해결되면 지우도록
      major: major,
      sid: sid,
    };
    const {data} = await addUserCampus(loginUser?.userid, userInfo);
    if (data) {
      alert("캠퍼스가 추가되었습니다! 재접속시 갱신됩니다.");
      navigate(-1);
    }
  };

  const handleSid = (e: any) => {
    setSid(e.target.value);
  };
  const handleMajor = (e: any) => {
    setMajor(e.target.value);
  };

  const onChangeCampus = (e: any) => {
    setOpen(true);
  };

  const onConfirm = () => {
    console.log("onConfirm >");
    const target: any = ref.current;
    target?.click();
  };

  if (isLoading) return <Loading />;
  if (isError) return <Error error={error} />;

  return (
    <>
      <MyHeader onConfirm={onConfirm} />
      <Box
        component="form"
        onSubmit={handleSubmit(writeRegister)}
        sx={{
          display: "flex",
          flexDirection: "column",
          // alignItems: "center",
          justifyContent: "left",
          marginTop: "20px",
          ".row": {display: "flex", alignItems: "center", marginTop: "3px"},
          ".header": {
            width: "70px",
            minHeight: "48px",
            padding: "0 10px 0 40px",
            fontSize: "16px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          },
          ".value": {minWidth: "200px", div: {maxHeight: "30px"}},
        }}>
        <Box className="row">
          <Box className="header">이름</Box>
          <Box className="value">
            <TextField {...register("name", {required: true})} value={name} InputProps={{readOnly: true}} />
          </Box>
        </Box>
        <Box className="row">
          <Box className="header">캠퍼스</Box>
          <Box className="value">
            <Box sx={{display: "flex", alignItems: "flex-end"}} onClick={onChangeCampus}>
              {campusSelected?.name || "캠퍼스를 선택해주세요."}
              <KeyboardArrowDownIcon sx={{width: 20, height: 20}} />
            </Box>
            <CampusDialog open={open} setOpen={setOpen} items={campusList} campusSelected={campusSelected} handleCampus={handleCampus} />
          </Box>
        </Box>

        <Box className="row">
          <Box className="header">학번</Box>
          <Box className="value">
            <TextField type={"number"} {...register("sid", {required: true})} value={sid} onChange={handleSid} />
          </Box>
        </Box>
        <Box className="row">
          <Box className="header">학과</Box>
          <Box className="value">
            <TextField {...register("major", {required: true})} value={major} onChange={handleMajor} />
          </Box>
        </Box>

        <Button ref={ref} variant="outlined" type="submit" sx={{display: "none"}}>
          저장
        </Button>
      </Box>
    </>
  );
}
function MyHeader({onConfirm}: any) {
  const {pathname} = useLocation();

  const navigate = useNavigate();
  const handlePrev = () => {
    navigate(-1);
  };
  return (
    <>
      <AppBar sx={{position: "relative", backgroundColor: "#292929!important", color: "white!important"}}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handlePrev} aria-label="close">
            <ArrowBackIosNewIcon color="secondary" />
          </IconButton>
          <Typography sx={{flex: 1}} variant="h6" component="div">
            {getTitle(pathname)}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={onConfirm} aria-label="close">
            <CheckIcon color="secondary" />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
}
