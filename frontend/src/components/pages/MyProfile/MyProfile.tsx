import React, {useEffect, useState} from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import Error from "components/Error/Error";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import {useRecoilState, useRecoilValue} from "recoil";

import {useNavigate} from "react-router-dom";
import {editUser, postLogout, postUserRegistAxios} from "@recoils/user/axios";
import {userGoogleAuthState} from "@recoils/Login/state";
import {postUser} from "@recoils/types";
import {userState} from "@recoils/user/state";
import {campusState} from "@recoils/campus/state";
import CampusDialog from "./modal/CampusDialog";

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
  //{campusid, cccyn,gender, major,nickname,sid}
  const navigate = useNavigate();

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
    const result = await editUser(loginUser?.userid, userInfo);
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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(writeRegister)}
      sx={{
        ".row": {display: "flex", alignItems: "center", marginTop: "5px"},
        ".header": {width: "80px", textAlign: "right", paddingRight: "10px", fontSize: "20px"},
      }}>
      <Box className="row">
        <Box className="header">이름</Box>
        <Box>
          <TextField {...register("name")} value={name} onChange={handleName} />
        </Box>
      </Box>
      <Box className="row">
        <Box className="header">캠퍼스</Box>
        <Box>
          <Button variant="outlined" onClick={onChangeCampus}>
            캠퍼스 선택
          </Button>
          <CampusDialog open={open} setOpen={setOpen} items={campusList} campusSelected={campusSelected} handleCampus={handleCampus} />
        </Box>
        {/* <Box sx={{width: "calc(100% - 80px)", paddingRight: "10px"}}>
          <Select
            {...register("campusid")}
            value={campusSelected}
            fullWidth
            onChange={handleCampusReceive}
            // renderValue={(selected: any) => selected?.name}
          >
            {campusList?.map((campus: any, index: number) => (
              <MenuItem key={index} value={campus} selected={index == 0}>
                <ListItemText primary={campus?.name} />
              </MenuItem>
            ))}
          </Select>
        </Box> */}
      </Box>

      <Box className="row">
        <Box className="header">학번</Box>
        <Box>
          <TextField {...register("sid")} value={sid} onChange={handleSid} />
        </Box>
      </Box>
      <Box className="row">
        {" "}
        <Box className="header">학과</Box>
        <Box>
          <TextField {...register("major")} value={major} onChange={handleMajor} />
        </Box>
      </Box>
      <Box className="row">
        {" "}
        <Box className="header">ccc 여부</Box>
        <Box>
          <RadioGroup
            // {...register("cccYN")}
            row
            aria-labelledby="demo-radio-buttons-group-label"
            // defaultValue="Y"
            // name="radio-buttons-group"
            value={(cccYNSelected as never) || null}
            onChange={handleCCCYNReceive}>
            <FormControlLabel value="Y" control={<Radio checked={cccYNSelected == "Y"} />} label="Y" />
            <FormControlLabel value="N" control={<Radio checked={cccYNSelected == "N"} />} label="N" />
          </RadioGroup>
        </Box>
      </Box>
      <Box className="row">
        {" "}
        <Box className="header">성별</Box>
        <Box>
          <RadioGroup
            // {...register("gender")}
            row
            aria-labelledby="demo-radio-buttons-group-label"
            value={(genderSelected as never) || null}
            onChange={handleGednerReceive}>
            <FormControlLabel value="female" control={<Radio checked={genderSelected == "female"} />} label="여자" />
            <FormControlLabel value="male" control={<Radio checked={genderSelected == "male"} />} label="남자" />
          </RadioGroup>
        </Box>
      </Box>

      <Box sx={{width: "100%", display: "flex", justifyContent: "center"}}>
        <Button variant="outlined" type="submit">
          저장
        </Button>
      </Box>
    </Box>
  );
}
