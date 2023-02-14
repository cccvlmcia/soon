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
import {getCampusListQuery} from "@recoils/api/User";
import Loading from "react-loading";
import {api} from "@recoils/consonants";
import {useRecoilState} from "recoil";
import {userGoogleAuthState, userState} from "@recoils/Login/state";
import {postUserRegistAxios} from "@recoils/Login/axios";
import { useNavigate } from "react-router-dom";

type FormData = {
  name: string;
  campus: string;
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
  const [campusList, setCampusList] = useState<campusType[]>([]);
  const [campusSelected, setCampusSelected] = useState<string[]>([]);
  const [genderSelected, setGenderSelected] = useState<string>();
  const [cccYNSelected, setCccYNSelected] = useState<string>();
  const [storedUser, setStoredUser] = useRecoilState(userState);
  const [campusIdSelected, setCampusIdSelected] = useState<string[]>([]);
  const [googleAuth, setGoogleAuth] = useRecoilState(userGoogleAuthState);
  const navigate = useNavigate();
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
    const auth = googleAuth;
    const userRegistInfo = {
      nickname: params.name,
      gender: genderSelected,
      cccyn: cccYNSelected,
      campusid: campusIdSelected[0], //FIXME: 단일 선택 문제 해결되면 지우도록
      major: params.major,
      sid: params.sid,
      ssoid: auth.ssoid,
      email: auth.email,
      type: auth.type,
    };
    console.log("userRegist data", userRegistInfo);
    const userRegist = postUserRegistAxios(userRegistInfo);
    navigate("/");
  };

  const fetchData = () => {
    if (isLoading) return <Loading />;
    if (isError) return <Error error={error} />;
    setCampusList(data);
  };
  useEffect(() => {
    fetchData();
  }, [data]);

  return (
    <Box component="form" onSubmit={handleSubmit(writeRegister)}>
      <Box>
        <Box sx={{fontSize: "16px"}}>이름</Box>
        <Box>
          <TextField {...register("name")} />
        </Box>
      </Box>
      <Box>
        <Box>캠퍼스</Box>
        <Box>
          <Select
            {...register("campus")}
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
        </Box>
      </Box>
      <Box>
        <Box>학번</Box>
        <Box>
          <TextField {...register("sid")} />
        </Box>
      </Box>
      <Box>
        <Box>학과</Box>
        <Box>
          <TextField {...register("major")} />
        </Box>
      </Box>
      <Box>
        <Box>ccc 여부</Box>
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
      <Box>
        <Box>성별</Box>
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

      <Box>
        <Button type="submit">저장</Button>
      </Box>
    </Box>
  );
};
export default Register;
