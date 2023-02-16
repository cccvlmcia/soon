import {ChangeEvent, useEffect, useState} from "react";
import {Box, TextField, Select, MenuItem, Button, SelectChangeEvent, Checkbox, ListItemText, FormControlLabel} from "@mui/material";
import {useForm, SubmitHandler} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import {styles} from "@layout/styles";
import {api} from "@recoils/consonants";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import Loading from "react-loading";
import Error from "components/Error/Error";
import {getCampusUserQuery} from "@recoils/api/User";
import HistoryCampusDialog from "./HistoryCampusDialog";
import {useRecoilValue} from "recoil";
import {userSelector, userState} from "@recoils/user/state";
type Prayer = {
  pray: string;
  publicyn: string;
};
type FormData = {
  soonjang: string;
  category: string;
  progress: string;
  date: string;
  contents: string;
  prayer: string;
  prays: Prayer[];
};

type User = {
  userid: string;
  nickname: string;
};

type Category = {
  id: string;
  name: string;
};

export default function HistoryWrite() {
  const [open, setOpen]: any = useState(false);
  const navigate = useNavigate();
  const {historyid} = useParams();
  const [date, setDate] = useState<Dayjs | null>(dayjs("2023-08-18T21:11:54"));
  const {register, handleSubmit, setValue, getValues} = useForm<FormData>(); // user
  const [userList, setUserList] = useState<User[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [categorySelected, setCategorySelected] = useState<string>("");
  const [prayers, setPrayers] = useState<Prayer[]>([{pray: "", publicyn: "true"}]);

  //FIXME: 현재 유저의 모든 정보를 가져 오는게 옳지 않은 듯?
  const authUser = useRecoilValue(userSelector);
  const {isLoading, isError, data, error} = getCampusUserQuery("UNIV102");

  const handleDateChange = (newValue: Dayjs | null) => setDate(newValue);

  const handlePrayerFieldChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const newValues = [...prayers];
    newValues[index].pray = event.target.value;
    setPrayers(newValues);
    setValue("prays", newValues); // Update the value of the 'prays' field in the form data object
  };
  const handleAddPrayerField = () => {
    setPrayers([...prayers, {pray: "", publicyn: "true"}]);
  };
  const handleDeletePrayerField = (index: number) => {
    const newValues = [...prayers];
    newValues.splice(index, 1);
    setPrayers(newValues);
    setValue("prays", newValues);
  };
  const onChangeUser = (e: any) => {
    setOpen(true);
  };

  const handlPublicynChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const newValues = [...prayers];
    newValues[index].publicyn = event.target.checked ? "true" : "false"; // Set value to "true" or "false" as a string
    setPrayers(newValues);
    setValue("prays", newValues); // Update the value of the 'prays' field in the form data object
  };
  // Method 순모임 받은 사람 핸들링
  const handleSwidReceive = (event: SelectChangeEvent<never[]>) => {
    const value = event.target.value as string;
    setSelected(typeof value === "string" ? value.split(",") : value);
  };

  const handleCategoryReceive = (event: SelectChangeEvent<never>) => {
    const value = event.target.value as string;
    setCategorySelected(typeof value === "string" ? value : value);
  };

  //error 처리....
  const writeHistory: SubmitHandler<FormData> = async (params: FormData) => {
    params.category = categorySelected;
    params.date = dayjs(date).format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    params.prays = prayers;

    console.log("params >> ", params);
    const result = await api.post(`/history`, params);
    if (result) {
      navigate("/");
    } else {
      console.log("SERVER에서 응답하지 않습니다");
    }
  };

  // 중간에 발생하는 값의 변화를 탐지하기 위함
  useEffect(() => {
    userListFunc();
    categoryFunc();
    fetchData();
  }, [historyid]);

  const handleUser = (user: any) => {};
  function fetchData() {
    if (isLoading) return <Loading />;
    if (isError) return <Error error={error} />;
  }
  const userListFunc = () => {
    const userList: User[] = data?.map(({user}: {user: User}) => {
      return {userid: user.userid, name: user.nickname};
    });
    console.log(userList);
    setUserList(userList || []);
  };
  // 순모임 종류 선택 사항
  const categoryFunc = () => {
    setCategoryList([
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
        <Button variant="outlined" onClick={onChangeUser}>
          해준 사람 선택
        </Button>
        <Box>
          <HistoryCampusDialog open={open} setOpen={setOpen} users={userList} userid="" handleUser={handleUser} />
          {/* <TextField {...register("soonjang")} /> */}
        </Box>
      </Box>
      <Box className="row">
        {/* 선택방법.. 분류 종류 */}
        <Box className="header">분류</Box>
        <Box sx={{width: "calc(100% - 100px)"}}>
          <Select value={categorySelected as never} fullWidth onChange={handleCategoryReceive} renderValue={selected => selected}>
            {categoryList.map((soonType: any, index: number) => (
              <MenuItem key={index} value={soonType.name}>
                <Checkbox checked={categorySelected.indexOf(soonType.name.toString()) > -1}></Checkbox>
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
          <Select value={selected as never} fullWidth multiple onChange={handleSwidReceive} renderValue={selected => selected.join(", ")}>
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
        <Box className="header">날짜</Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            label="Date mobile"
            inputFormat="MM/DD/YYYY"
            value={date}
            onChange={handleDateChange}
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
      <Box>
        <Box>기도 제목</Box>
        <Box>
          {prayers.map((value, index) => (
            <Box key={index} sx={{display: "flex", alignItems: "center", mb: 2}}>
              <TextField sx={{mr: 2}} value={value.pray} onChange={(event: ChangeEvent<HTMLInputElement>) => handlePrayerFieldChange(event, index)} />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value.publicyn === "true" ? true : false}
                    onChange={event => handlPublicynChange(event, index)}
                    name={`publicyn-${index}`}
                  />
                }
                label="Public"
              />
              <Button sx={{ml: 2}} onClick={() => handleDeletePrayerField(index)}>
                Delete
              </Button>
            </Box>
          ))}

          <Button onClick={handleAddPrayerField}>Add Prayer Field</Button>
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
