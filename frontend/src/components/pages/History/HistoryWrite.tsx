
import {useEffect, useState} from "react";
import axios from "axios";
import {Box, TextField, Select, MenuItem, Button, SelectChangeEvent, Checkbox, ListItemText} from "@mui/material";
import {useForm, SubmitHandler} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import {styles} from "@layout/styles";
import {api} from "@recoils/consonants";

import {postSoon} from "@recoils/user/axios";


import {ChangeEvent, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";

type FormData = {
  giver: string;
  kind: string;
  progress: string;
  taker: string;
  date: string;
  contents: string;
  prays: {pray: string; publicyn: boolean}[];
};

export default function HistoryWrite() {
  const [textFields, setTextFields] = useState<{pray: string; publicyn: boolean}[]>([]);
  const {register, handleSubmit, setValue, getValues} = useForm<FormData>();

  const handleAddTextField = () => {
    setTextFields([...textFields, {pray: "", publicyn: true}]);
  };

  //error 처리....
  const writeHistory: SubmitHandler<FormData> = async (params: FormData) => {
    params.list = selected;
    console.log("params >> ", params);
    const result = await api.post(`/history`, params);
    if (result) {
      navigate("/");
    } else {
      console.log("SERVER에서 응답하지 않습니다");
    }

  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValues = [...textFields];
    newValues[index].publicyn = event.target.checked;
    setTextFields(newValues);
    setValue("prays", newValues); // Update the value of the 'prays' field in the form data object
  };

  const writeSoon: SubmitHandler<FormData> = async (params: FormData) => {
    const soonInfo = {
      userid: 70,
      sjid: 70,
      swid: 70,
      kind: params.kind,
      progress: params.progress,
      //FIXME: Date로 받도록 할 것
      historydate: new Date(),
      contents: params.contents,
      //FIXME: pray의 publiccyn이거 boolean 값으로 바꿀 것
      prays: null,
    };
    console.log("Form data:", soonInfo);
    await postSoon(soonInfo);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(writeHistory)}
      sx={[
        historyid ? styles.mobile.container : styles.web.container,
        styles.web.writeform,
        {
          ".row": {display: "flex", alignItems: "center", marginTop: "5px"},
          ".header": {width: "80px", textAlign: "right", paddingRight: "10px", fontSize: "16px"},
        },
      ]}>
      <Box sx={styles.text}>순모임 히스토리 기록</Box>
      <Box className="row">
        <Box className="header">해준 사람</Box>
        {/* 선택방법.. 사용자 선택 */}
        <Box>
          <TextField {...register("soonjang")} />
        </Box>
      </Box>
      <Box className="row">
        {/* 선택방법.. 분류 종류 */}
        <Box className="header">분류</Box>
        <Box>
          <TextField {...register("category")} />
        </Box>
      </Box>
      <Box className="row">
        <Box className="header">진도</Box>
        <Box>
          <TextField {...register("progress")} />
        </Box>
      </Box>
      <Box className="row">
        {/* 선택방법.. 사용자 선택 */}
        <Box className="header">받은 사람</Box>
        <Box sx={{width: "calc(100% - 100px)"}}>
          <Select value={selected as never} fullWidth multiple onChange={handleReceive} renderValue={selected => selected.join(", ")}>
            {userList.map((user: any, index: number) => (
              <MenuItem key={index} value={user.name}>
                <Checkbox checked={selected.indexOf(user.name.toString()) > -1}></Checkbox>
                <ListItemText primary={user.name} />
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
      <Box className="row">
        {/*날짜 선택 */}
        <Box className="header">날짜</Box>
        <Box>
          <TextField {...register("date")} />
        </Box>
      </Box>
      <Box className="row">
        <Box className="header">내용</Box>
        <Box>
          <TextField multiline rows={4} {...register("contents")} />
        </Box>
      </Box>
      <Box className="row">
        {/* 여러줄 추가 / 비밀여부... / textarea? */}
        <Box className="header">기도제목</Box>
        <Box>
          <TextField {...register("prayer")} />
        </Box>

      </Box>
      <Box sx={{width: "100%", display: "flex", justifyContent: "center", marginTop: "10px"}}>
        <Button variant="outlined" type="submit">
          저장
        </Button>
      </Box>
    </Box>
  );
}
