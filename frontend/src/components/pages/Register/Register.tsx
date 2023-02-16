import React, {useEffect, useState} from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import Error from "components/Error/Error";
import {Box, TextField, Button, SelectChangeEvent, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import {getCampusListQuery} from "@recoils/api/User";
import Loading from "react-loading";
import {useRecoilValue, useSetRecoilState} from "recoil";

import {useNavigate} from "react-router-dom";
import {postLogout, postUserRegistAxios} from "@recoils/user/axios";
import {userGoogleAuthState} from "@recoils/Login/state";
import {postUser} from "@recoils/types";
import {userState} from "@recoils/user/state";
import CampusDialog from "@pages/MyProfile/modal/CampusDialog";

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
const Register: React.FC = () => {
  const {isLoading, isError, data, error} = getCampusListQuery();
  const {register, handleSubmit} = useForm<FormData>();
  const setLoginUser = useSetRecoilState(userState);
  const [campusList, setCampusList] = useState<campusType[]>([]);
  const [campus, setCampus] = useState<any>(null);
  const [campusSelected, setCampusSelected] = useState<string[]>([]);
  const [genderSelected, setGenderSelected] = useState<string>();
  const [cccYNSelected, setCccYNSelected] = useState<string>();
  const [campusIdSelected, setCampusIdSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const googleAuth = useRecoilValue(userGoogleAuthState);
  const navigate = useNavigate();

  const onChangeCampus = (event: SelectChangeEvent<never[]>) => {
    setOpen(true);
  };
  const handleCampus = (campus: any) => {
    setCampus(campus);
    setCampusSelected([campus?.name]);
    setCampusIdSelected([campus?.campusid]);
  };
  const handleCampusReceive = (event: SelectChangeEvent<never[]>) => {
    const selectedNames = event.target.value as string[];
    const selectedIds = selectedNames.map(name => {
      const campus: campusType = campusList.find(campus => campus.name === name) || {campusid: "", name: "", areaid: "", useyn: "", createdate: ""};
      return campus ? campus.campusid : "0";
    });
    setCampusSelected(selectedNames);
    setCampusIdSelected(selectedIds);
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
    // params.list = selected;
    // console.log(googleAuth);
    const {auth} = googleAuth;
    // const auth = {ssoid: "test", email: "test", type: "test"};
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
    console.log("userRegist data", userRegistInfo);
    // userInfo: {name: string; campus: string; sid: string; major: string; cccYN: string; gender: string}
    const userRegist = await postUserRegistAxios(userRegistInfo);
    console.log("userRegist >", userRegist);
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
          <TextField {...register("name")} />
        </Box>
      </Box>
      {/*단일만 선택 가능하도록 일단 마무리 */}
      <Box className="row">
        <Box className="header">캠퍼스</Box>
        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
          <Button variant="outlined" onClick={onChangeCampus}>
            캠퍼스 선택
          </Button>
          <Box>{...campusSelected}</Box>
          <CampusDialog open={open} setOpen={setOpen} items={campusList} campusSelected={campus} handleCampus={handleCampus} />
        </Box>
        {/* <Box sx={{width: "calc(100% - 80px)", paddingRight: "10px"}}>
          <Select
            {...register("campusid")}
            value={campusSelected as never}
            fullWidth
            multiple
            onChange={handleCampusReceive}
            renderValue={selected => selected.join(", ")}>
            {campusList.map(({name, campusid}: any, index: number) => (
              <MenuItem key={index} value={name}>
                <Checkbox checked={campusSelected.indexOf(name.toString()) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </Box> */}
      </Box>
      <Box className="row">
        {" "}
        <Box className="header">학번</Box>
        <Box>
          <TextField {...register("sid")} />
        </Box>
      </Box>
      <Box className="row">
        {" "}
        <Box className="header">학과</Box>
        <Box>
          <TextField {...register("major")} />
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
            <FormControlLabel value="Y" control={<Radio />} label="Y" />
            <FormControlLabel value="N" control={<Radio />} label="N" />
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
            <FormControlLabel value="female" control={<Radio />} label="female" />
            <FormControlLabel value="male" control={<Radio />} label="male" />
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
};
export default Register;
