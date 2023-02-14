import React, {useEffect, useState} from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import Error from "components/Error/Error";
import axios from "axios";
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
  FormControl,
} from "@mui/material";
import {getCampusListQuery} from "@recoils/api/User";
import Loading from "react-loading";
import {api} from "@recoils/consonants";
import {getStorage} from "utils/SecureStorage";
import {useRecoilState} from "recoil";
import {userState} from "@recoils/user/state";

type FormData = {
  name: string;
  campus: string;
  sid: string;
  major: string;
  cccYN: string;
  gender: string;
};

const Register: React.FC = () => {
  const {isLoading, isError, data, error} = getCampusListQuery();
  const navigate = useNavigate();
  const {register, handleSubmit} = useForm<FormData>();
  const [campusList, setCampusList] = useState<object[]>([]);
  const [campusSelected, setCampusSelected] = useState<string[]>([]);
  const [genderSelected, setGenderSelected] = useState<string>();
  const [cccYNSelected, setCccYNSelected] = useState<string>();
  const [storedUser, setStoredUser] = useRecoilState(userState);

  const handleCampusReceive = (event: SelectChangeEvent<never[]>) => {
    const value = event.target.value as string;
    setCampusSelected(typeof value === "string" ? value.split(",") : value);
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
    console.log("params >> ", params);
    const {auth} = JSON.parse(storedUser);

    console.log("userGoogleInfo : ", auth);
    // console.log(userGoogleInfo);
    const userRegistInfo = {
      nickname: params.name,
      gender: genderSelected,
      cccyn: cccYNSelected,
      campusid: params.campus, //FIXME: 단일 선택 문제 해결되면 지우도록
      major: params.major,
      sid: params.sid,
      ssoid: auth.ssoid,
      email: auth.email,
      type: auth.type,
    };
    console.log("userRegist data", userRegistInfo);
    const userRegist = await api.post("/user", userRegistInfo);
    console.log(userRegist);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isLoading) return <Loading />;
      if (isError) return <Error error={error} />;
      setCampusList(data);
    };
    fetchData();
  }, [data, genderSelected, cccYNSelected]);

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
            {campusList.map((campus: any, index: number) => (
              <MenuItem key={index} value={campus.campusid}>
                <Checkbox checked={campusSelected.indexOf(campus.campusid.toString()) > -1} />
                <ListItemText primary={campus.name} />
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
