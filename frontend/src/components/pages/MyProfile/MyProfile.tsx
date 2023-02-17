import React, {useEffect, useRef, useState} from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import {useRecoilState} from "recoil";
import {Box, TextField, Button, SelectChangeEvent, FormControlLabel, Radio, RadioGroup, AppBar, Toolbar, IconButton, Typography} from "@mui/material";

import {editUser} from "@recoils/user/axios";
import {userState} from "@recoils/user/state";
import CampusDialog from "./modal/CampusDialog";
import {useLocation, useNavigate} from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
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
export default function MyProfile() {
  // const {isLoading, isError, data, error} = getCampusListQuery();
  const ref = useRef(null);

  const {register, handleSubmit} = useForm<FormData>();
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const campuses = loginUser?.campus?.map(({campus}: any) => campus);
  const [campusList, setCampusList] = useState(campuses);
  const [campusSelected, setCampusSelected]: any = useState(campuses && campuses[0]);
  const [genderSelected, setGenderSelected] = useState<string>(loginUser?.gender);
  const [cccYNSelected, setCccYNSelected] = useState<string>(loginUser?.config?.cccyn);
  const [name, setName] = useState<string>(loginUser?.nickname);
  const [sid, setSid] = useState<string>(getSid(campusSelected?.campusid));
  const [major, setMajor] = useState<string>(getMajor(campusSelected?.campusid));
  const [user, setUser]: any = useState(null);
  const [open, setOpen]: any = useState(false);
  const navigate = useNavigate();

  //{campusid, cccyn,gender, major,nickname,sid}

  function getSid(camid: string) {
    return loginUser?.campus?.find(({campusid}: any) => campusid == camid)?.sid;
  }
  function getMajor(camid: string) {
    return loginUser?.campus?.find(({campusid}: any) => campusid == camid)?.major;
  }
  useEffect(() => {
    if (loginUser) {
      // setSeleceted()
    }
  }, [loginUser]);
  //FIXME: set 하는 방식을 id > obj로 변경 필요
  const handleCampus = (campus: any) => {
    setCampusSelected(campus);
    setSid(getSid(campus?.campusid));
    setMajor(getMajor(campus?.campusid));
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
  const writeRegister: SubmitHandler<FormData> = async (params: FormData) => {
    const userInfo = {
      nickname: name,
      gender: genderSelected || "",
      cccyn: cccYNSelected || "",
      campusid: campusSelected?.campusid, //FIXME: 단일 선택 문제 해결되면 지우도록
      major: major,
      sid: sid,
    };
    const {data} = await editUser(loginUser?.userid, userInfo);
    if (data?.affected > 0) {
      alert("저장되었습니다, 재 로그인 적용됩니다.");
      navigate(-1);
    }
  };

  const handleName = (e: any) => {
    setName(e.target.value);
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
          ".row": {display: "flex", alignItems: "center", marginTop: "5px"},
          ".header": {width: "120px", textAlign: "right", paddingRight: "10px", fontSize: "16px"},
          ".value": {minWidth: "200px"},
        }}>
        <Box className="row">
          <Box className="header">이름</Box>
          <Box className="value">
            <TextField {...register("name")} value={name} onChange={handleName} />
          </Box>
        </Box>
        <Box className="row">
          <Box className="header">
            <Button variant="outlined" onClick={onChangeCampus}>
              캠퍼스 선택
            </Button>
          </Box>
          <Box className="value">
            <Box>{campusSelected?.name}</Box>
            <CampusDialog open={open} setOpen={setOpen} items={campusList} campusSelected={campusSelected} handleCampus={handleCampus} />
          </Box>
        </Box>

        <Box className="row">
          <Box className="header">학번</Box>
          <Box className="value">
            <TextField {...register("sid")} value={sid} onChange={handleSid} />
          </Box>
        </Box>
        <Box className="row">
          <Box className="header">학과</Box>
          <Box className="value">
            <TextField {...register("major")} value={major} onChange={handleMajor} />
          </Box>
        </Box>
        <Box className="row">
          <Box className="header">ccc 여부</Box>
          <Box className="value">
            <RadioGroup row value={(cccYNSelected as never) || null} onChange={handleCCCYNReceive}>
              <FormControlLabel value="Y" control={<Radio checked={cccYNSelected == "Y"} />} label="Y" />
              <FormControlLabel value="N" control={<Radio checked={cccYNSelected == "N"} />} label="N" />
            </RadioGroup>
          </Box>
        </Box>
        <Box className="row">
          <Box className="header">성별</Box>
          <Box className="value">
            <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" value={(genderSelected as never) || null} onChange={handleGednerReceive}>
              <FormControlLabel value="female" control={<Radio checked={genderSelected == "female"} />} label="여자" />
              <FormControlLabel value="male" control={<Radio checked={genderSelected == "male"} />} label="남자" />
            </RadioGroup>
          </Box>
        </Box>
        {/* <Box sx={{width: "100%", display: "flex", justifyContent: "center"}}> */}
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
      <AppBar sx={{position: "relative", backgroundColor: "#000000!important", color: "white!important"}}>
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
