import {useRef, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useLocation, useNavigate} from "react-router-dom";
import {useRecoilValue, useSetRecoilState} from "recoil";
import Loading from "react-loading";
import {Box, TextField, Button, SelectChangeEvent, FormControlLabel, Radio, RadioGroup} from "@mui/material";

import Error from "components/Error/Error";
import {postLogout, postUserRegistAxios} from "@recoils/user/axios";
import {userGoogleAuthState} from "@recoils/login/state";
import {postUser} from "@recoils/types";
import {userState} from "@recoils/user/state";
import CampusDialog from "@pages/MyProfile/modal/CampusDialog";
import {getCampusListQuery} from "@recoils/campus/query";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {getTitle} from "@layout/header/HeaderConstants";
import CheckIcon from "@mui/icons-material/Check";

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
export default function Register() {
  const ref = useRef(null);

  const {isLoading, isError, data, error} = getCampusListQuery();
  const {register, handleSubmit} = useForm<FormData>();
  const setLoginUser = useSetRecoilState(userState);
  const [campusList, setCampusList] = useState<campusType[]>([]);
  const [campus, setCampus] = useState<any>(null);
  const [campusSelected, setCampusSelected] = useState<string[]>([]);
  const [genderSelected, setGenderSelected] = useState<string>("female");
  const [cccYNSelected, setCccYNSelected] = useState<string>("Y");
  const [campusIdSelected, setCampusIdSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const googleAuth = useRecoilValue(userGoogleAuthState);
  const navigate = useNavigate();
  const onChangeCampus = () => {
    setOpen(true);
  };
  const handleCampus = (campus: any) => {
    setCampus(campus);
    setCampusSelected([campus?.name]);
    setCampusIdSelected([campus?.campusid]);
  };

  const handleGednerReceive = (event: SelectChangeEvent<never>) => {
    const value = event.target.value;
    console.log("gender : ", value);
    setGenderSelected(value);
  };
  const handleCCCYNReceive = (event: SelectChangeEvent<never>) => {
    const value = event.target.value;
    console.log("cccYN : ", value);
    setCccYNSelected(value);
  };
  const writeRegister = async (params: any) => {
    if (campus == null) {
      alert("캠퍼스를 선택해주세요.");
      return;
    }
    // console.log("params >", params);
    const {auth} = googleAuth;
    const userRegistInfo: postUser = {
      nickname: params.name,
      gender: genderSelected || "",
      cccyn: cccYNSelected || "",
      campusid: campusIdSelected[0], //FIXME: 단일 선택 문제 해결되면 지우도록
      major: params.major,
      sid: params.sid,
      ssoid: auth.ssoid,
      email: auth.email,
      type: auth.type,
    };
    // console.log("userRegist data", userRegistInfo);
    // userInfo: {name: string; campus: string; sid: string; major: string; cccYN: string; gender: string}
    const userRegist = await postUserRegistAxios(userRegistInfo);
    // console.log("userRegist >", userRegist);
    // 기존 사용자 정보 삭제 및 로그아웃 처리
    await postLogout();
    setLoginUser(null);

    navigate("/");
  };

  const fetchData = () => {
    if (googleAuth == null || googleAuth?.status != "REGISTER") {
      navigate("/");
    }
    if (isLoading) return <Loading />;
    if (isError) return <Error error={error} />;
    setCampusList(data);
  };

  useEffect(() => {
    fetchData();
  }, [data]);

  const onConfirm = () => {
    console.log("onConfirm >");
    const target: any = ref.current;
    target?.click();
  };

  return (
    <Box>
      <MyHeader onConfirm={onConfirm} />
      <Box sx={{display: "flex", justifyContent: "center"}}>
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
              padding: "0 10px 0 0",
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
              <TextField {...register("name", {required: true})} />
            </Box>
          </Box>
          {/*단일만 선택 가능하도록 일단 마무리 */}
          <Box className="row">
            <Box className="header">캠퍼스</Box>
            <Box className="value">
              <Box sx={{display: "flex", alignItems: "flex-end"}} onClick={onChangeCampus}>
                {campusSelected?.length > 0 ? campusSelected : "캠퍼스를 선택해주세요."}
                <KeyboardArrowDownIcon sx={{width: 20, height: 20}} />
              </Box>
              <CampusDialog open={open} setOpen={setOpen} items={campusList} campusSelected={campus} handleCampus={handleCampus} />
            </Box>
          </Box>
          <Box className="row">
            <Box className="header">학번</Box>
            <Box className="value">
              <TextField type={"number"} {...register("sid", {required: true})} />
            </Box>
          </Box>
          <Box className="row">
            <Box className="header">학과</Box>
            <Box className="value">
              <TextField {...register("major", {required: true})} />
            </Box>
          </Box>
          <Box className="row">
            <Box className="header">ccc 여부</Box>
            <Box className="value">
              <RadioGroup row value={(cccYNSelected as never) || null} onChange={handleCCCYNReceive}>
                <FormControlLabel value="Y" control={<Radio checked />} label="Y" />
                <FormControlLabel value="N" control={<Radio />} label="N" />
              </RadioGroup>
            </Box>
          </Box>
          <Box className="row">
            <Box className="header">성별</Box>
            <Box className="value">
              <RadioGroup row aria-labelledby="radio-buttons-group-label" value={(genderSelected as never) || null} onChange={handleGednerReceive}>
                <FormControlLabel value="female" control={<Radio />} label="여" />
                <FormControlLabel value="male" control={<Radio />} label="남" />
              </RadioGroup>
            </Box>
          </Box>

          <Box sx={{width: "100%", display: "none", justifyContent: "center"}}>
            <Button ref={ref} variant="outlined" type="submit">
              저장
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
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
      <AppBar sx={{position: "relative", backgroundColor: "#000000!important", color: "white!important"}}>
        <Toolbar>
          {/* <IconButton edge="start" color="inherit" onClick={handlePrev} aria-label="close">
            <MenuIcon color="secondary" />
          </IconButton> */}
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
