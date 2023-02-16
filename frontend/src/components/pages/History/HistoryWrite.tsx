import {ChangeEvent, useEffect, useState} from "react";
import {Box, TextField, Select, MenuItem, Button, SelectChangeEvent, Checkbox, ListItemText, FormControlLabel} from "@mui/material";
import {useForm, SubmitHandler} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import {styles} from "@layout/styles";
import {api} from "@recoils/constants";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import Loading from "react-loading";
import Error from "components/Error/Error";
import HistoryCampusDialog from "./HistoryCampusDialog";
import {useRecoilValue} from "recoil";
import {userSelector, userState} from "@recoils/user/state";
import {getCampusUserQuery} from "@recoils/campus/query";
type Prayer = {
  pray: string;
  publicyn: string;
};
type FormData = {
  sjid: string;
  swid: string;
  kind: string;
  progress: string;
  historydate: Date;
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
  const {historyid} = useParams();
  const navigate = useNavigate();
  const {register, handleSubmit, setValue, getValues} = useForm<FormData>(); // user
  const [SoonwonOpen, setSoonwonOpen]: any = useState(false);
  const [SoonjangOpen, setSoonjangOpen]: any = useState(false);
  const [date, setDate] = useState<Dayjs | null>(dayjs("2023-08-18T21:11:54"));
  const [userList, setUserList] = useState<User[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [categorySelected, setCategorySelected] = useState<string>("");
  const {isLoading, isError, data, error} = getCampusUserQuery("UNIV102");
  const [prayers, setPrayers] = useState<Prayer[]>([{pray: "", publicyn: "Y"}]);

  const onChangeSoonjang = (e: any) => {
    setSoonjangOpen(true);
  };
  const onChangeSoonwon = (e: any) => {
    setSoonwonOpen(true);
  };

  //선택 된 유저는 공통 관리
  const [selectedUsers, setSeletedUsers] = useState<User[]>([]);
  //FIXME: 해주는 사람과 받는 사람이 일단 단일이니까, 한명씩으로 구현, 추후 인원 늘리면 수정 바람
  const [soonjang, setSoonjang] = useState<User>({userid: "0", nickname: ""});
  const [soonwon, setSoonwon] = useState<User>({userid: "0", nickname: ""});
  //TODO: 순장 순원 삭제 기능 필요하면 추가하도록
  // const handleDeleteSoonjang = () => {};
  // const handleDeleteSoonwon = () => {};
  const handleSoonjang = (newSoonjang: User) => {
    setSoonjang(newSoonjang);
    setSeletedUsers([newSoonjang, soonwon]);
    // setSeletedUsers(userList.filter(user => user != soonjang && user != soonwon));
    // console.log("soonjang 수정 : ", newSoonjang, soonjang);
    console.log("seleted user가 될 값: ", [newSoonjang, soonwon]);
    console.log("seleteduser : ", selectedUsers);
  };
  const handleSoonwon = (newSoonwon: User) => {
    setSoonwon(newSoonwon);
    setSeletedUsers([newSoonwon, soonjang]);
    // setSeletedUsers(userList.filter(user => user == newSoonwon || user == soonjang));

    // console.log("soonwon 수정 : ", , soonwon);
    console.log("seleteduser : ", selectedUsers);
  };

  const handleDateChange = (newValue: Dayjs | null) => setDate(newValue);
  const handlePrayerFieldChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const newValues = [...prayers];
    newValues[index].pray = event.target.value;
    setPrayers(newValues);
    setValue("prays", newValues); // Update the value of the 'prays' field in the form data object
  };
  const handleAddPrayerField = () => {
    setPrayers([...prayers, {pray: "", publicyn: "Y"}]);
  };
  const handleDeletePrayerField = (index: number) => {
    const newValues = [...prayers];
    newValues.splice(index, 1);
    setPrayers(newValues);
    setValue("prays", newValues);
  };

  const handlPublicynChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const newValues = [...prayers];
    newValues[index].publicyn = event.target.checked ? "Y" : "N"; // Set value to "true" or "false" as a string
    setPrayers(newValues);
    setValue("prays", newValues); // Update the value of the 'prays' field in the form data object
  };

  const handleCategoryReceive = (event: SelectChangeEvent<never>) => {
    const value = event.target.value as string;
    setCategorySelected(typeof value === "string" ? value : value);
  };

  //error 처리....
  const sendHistory: SubmitHandler<FormData> = async (params: FormData) => {
    console.log("순장 순원 ", soonjang, soonwon);
    //FIXME: soonjang/soonwon id 디폴트 값 0 이라 예외처리 함. 추후 모달 창이나, 백에서 처리하도록 수정 바람
    if (soonjang.userid == "0" || soonwon.userid == "0") {
      console.log("순장/순원 선택 바랍니다");
      return;
    }
    params.kind = categorySelected;
    params.historydate = new Date(dayjs(date).format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"));
    // params.historydate = Date(date);
    params.prays = prayers;
    params.sjid = soonjang.userid;
    params.swid = soonwon.userid;

    console.log("params >> ", params);
    const result = await api.post(`soon/history`, params);
    if (result) {
      navigate("/");
    } else {
      console.log("SERVER에서 응답하지 않습니다");
    }
  };

  useEffect(() => {
    userListFunc();
    categoryFunc();
    fetchData();
  }, [historyid, soonjang, soonwon]);

  function fetchData() {
    if (isLoading) return <Loading />;
    if (isError) return <Error error={error} />;
  }
  const userListFunc = () => {
    const userList: User[] = data?.map(({user}: {user: User}) => {
      return {userid: user.userid, nickname: user.nickname};
    });
    // console.log("user list : ", userList);
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
      onSubmit={handleSubmit(sendHistory)}
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
        <Box sx={{width: "200px"}}>{soonjang.nickname}</Box>

        <Box>
          <Button variant="outlined" onClick={onChangeSoonjang}>
            해준 사람 선택
          </Button>
          <HistoryCampusDialog
            open={SoonjangOpen}
            setOpen={setSoonjangOpen}
            users={userList}
            selectedUsers={selectedUsers}
            handleUser={handleSoonjang}
          />
          {/* <Button sx={{ml: 2}} onClick={() => handleDeleteSoonjang()}>
            Delete
          </Button> */}
        </Box>
      </Box>
      <Box className="row">
        {/* 선택방법.. 분류 종류 */}
        <Box className="header">분류</Box>
        <Box sx={{width: "calc(100% - 100px)"}}>
          <Select value={categorySelected as never} fullWidth onChange={handleCategoryReceive} renderValue={selected => selected}>
            {categoryList.map((soonType: any, index: number) => (
              <MenuItem key={index} value={soonType.id}>
                <Checkbox checked={categorySelected.indexOf(soonType.id.toString()) > -1}></Checkbox>
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
        <Box sx={{width: "200px"}}>{soonwon.nickname}</Box>

        <Button variant="outlined" onClick={onChangeSoonwon}>
          받은 사람 선택
        </Button>
        <HistoryCampusDialog open={SoonwonOpen} setOpen={setSoonwonOpen} users={userList} selectedUsers={selectedUsers} handleUser={handleSoonwon} />
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
                    checked={value.publicyn === "Y" ? true : false}
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
