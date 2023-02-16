import {useEffect, useState} from "react";
import {Box, TextField, Select, MenuItem, Button, SelectChangeEvent, Checkbox, ListItemText} from "@mui/material";
import {useForm, SubmitHandler} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import {styles} from "@layout/styles";
import {api} from "@recoils/consonants";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
// import moment from "moment";
export default function HistoryWrite() {
  const navigate = useNavigate();
  const {historyid} = useParams();
  const [date, setDate] = useState<Dayjs | null>(dayjs("2023-08-18T21:11:54"));
  const {register, handleSubmit} = useForm<FormData>(); //user
  const [userList, setUserList] = useState<Object[]>([]);
  const [categoryList, setCateogryList] = useState<Object[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [cateogrySelected, setCateogrySelected] = useState<string>("");

  const handleChange = (newValue: Dayjs | null) => {
    setDate(newValue);
    // console.log(date.$d);
  };
  const handleReceive = (event: SelectChangeEvent<never[]>) => {
    const value = event.target.value as string;
    setSelected(typeof value === "string" ? value.split(",") : value);
  };
  const handleCateoryReceive = (event: SelectChangeEvent<never>) => {
    const value = event.target.value as string;
    setCateogrySelected(typeof value === "string" ? value : value);
  };

  //error 처리....
  const writeHistory: SubmitHandler<FormData> = async (params: FormData) => {
    params.list = selected; //
    params.category = cateogrySelected;
    params.date = dayjs(date).format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    console.log("params >> ", params);
    const result = await api.post(`/history`, params);
    if (result) {
      navigate("/");
    } else {
      console.log("SERVER에서 응답하지 않습니다");
    }
  };
  type FormData = {
    soonjang: string;
    category: string;
    progress: string;
    date: string;
    contents: string;
    prayer: string;
    list: string[];
  };
  // 중간에 발생하는 값의 변화를 탐지하기 위함
  useEffect(() => {
    userListFunc();
    categoryFunc();
  }, [historyid]);

  const userListFunc = () => {
    setUserList([
      {userid: "1", name: "김이박"},
      {userid: "2", name: "고범수"},
      {userid: "3", name: "주님"},
    ]);
  };
  // 순모임 종류 선택 사항
  const categoryFunc = () => {
    setCateogryList([
      {id: "soon", name: "순모임"}, //순모임
      {id: "coffee", name: "커피 타임"}, //커피타임
      {id: "activity", name: "외부 활동"}, //외부활동
      {id: "unity", name: "합동 순모임"}, //합동 순모임
    ]);
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
        <Box sx={{width: "calc(100% - 100px)"}}>
          <Select value={cateogrySelected as never} fullWidth onChange={handleCateoryReceive} renderValue={selected => selected}>
            {categoryList.map((soonType: any, index: number) => (
              <MenuItem key={index} value={soonType.name}>
                <Checkbox checked={cateogrySelected.indexOf(soonType.name.toString()) > -1}></Checkbox>
                <ListItemText primary={soonType.name} />
              </MenuItem>
            ))}
          </Select>
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            label="Date mobile"
            inputFormat="MM/DD/YYYY"
            value={date}
            onChange={handleChange}
            renderInput={params => <TextField {...params} />}
          />
        </LocalizationProvider>
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
