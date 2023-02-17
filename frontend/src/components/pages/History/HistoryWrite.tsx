import {ChangeEvent, useEffect, useState, useRef} from "react";
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
  AppBar,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import {useForm, SubmitHandler} from "react-hook-form";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {styles} from "@layout/styles";
import {api} from "@recoils/constants";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import Loading from "react-loading";
import Error from "components/Error/Error";
import HistoryCampusDialog from "./HistoryCampusDialog";
import {getCampusUserQuery} from "@recoils/campus/query";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {getTitle} from "@layout/header/HeaderConstants";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {useRecoilValue} from "recoil";
import {userState} from "@recoils/user/state";

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
  const ref = useRef(null);
  const loginUser: any = useRecoilValue(userState);
  const {historyid} = useParams();
  const navigate = useNavigate();
  const {register, handleSubmit, setValue, getValues} = useForm<FormData>(); // user
  const [SoonwonOpen, setSoonwonOpen]: any = useState(false);
  const [SoonjangOpen, setSoonjangOpen]: any = useState(false);
  const [date, setDate]: any = useState(new Date());
  const [userList, setUserList] = useState<User[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [categorySelected, setCategorySelected]: any = useState(null);
  const campusid = loginUser?.campus[0]?.campusid || "UNIV102";
  const {isLoading, isError, data, error} = getCampusUserQuery(campusid);
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
    const value = event.target.value;
    setCategorySelected(value);
  };
  //error 처리....
  const sendHistory: SubmitHandler<FormData> = async (params: FormData) => {
    console.log("순장 순원 ", soonjang, soonwon);
    //FIXME: soonjang/soonwon id 디폴트 값 0 이라 예외처리 함. 추후 모달 창이나, 백에서 처리하도록 수정 바람
    if (soonjang.userid == "0" || soonwon.userid == "0") {
      console.log("순장/순원 선택 바랍니다");
      alert("순장/순원 선택 바랍니다");
      return;
    }
    params.kind = categorySelected?.id;
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
  }, [data, historyid, soonjang, soonwon]);

  function fetchData() {
    if (isLoading) return <Loading />;
    if (isError) return <Error error={error} />;
  }
  const userListFunc = () => {
    const userList: User[] = data?.map(({user}: {user: User}) => {
      return {userid: user.userid, nickname: user.nickname};
    });
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
        onSubmit={handleSubmit(sendHistory)}
        sx={[
          historyid ? styles.mobile.container : styles.web.container,
          styles.web.writeform,
          {
            ".row": {display: "flex", alignItems: "center", marginTop: "5px"},
            ".header": {width: "120px", textAlign: "right", paddingRight: "10px", fontSize: "16px"},
          },
        ]}>
        <Box className="row">
          <Box className="header">
            <Button variant="outlined" onClick={onChangeSoonjang}>
              순장선택
            </Button>
          </Box>
          <Box sx={{width: "200px"}}>{soonjang.nickname}</Box>
          <Box>
            <HistoryCampusDialog
              open={SoonjangOpen}
              setOpen={setSoonjangOpen}
              users={userList}
              selectedUsers={selectedUsers}
              handleUser={handleSoonjang}
            />
          </Box>
        </Box>
        <Box className="row">
          {/* 선택방법.. 분류 종류 */}
          <Box className="header">분류</Box>
          <Box sx={{width: "calc(100% - 200px)"}}>
            <Select
              size="small"
              value={categorySelected?.name || ""}
              fullWidth
              onChange={handleCategoryReceive}
              renderValue={selected => {
                console.log(selected);
                return selected;
              }}>
              {categoryList.map((soonType: any, index: number) => (
                <MenuItem key={index} value={soonType}>
                  <Checkbox checked={categorySelected?.id == soonType.id}></Checkbox>
                  <ListItemText primary={soonType.name} />
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        <Box className="row">
          <Box className="header">진도</Box>
          <Box>
            <TextField size="small" {...register("progress")} />
          </Box>
        </Box>
        <Box className="row">
          {/* 선택방법.. 사용자 선택 */}
          <Box className="header">
            {" "}
            <Button variant="outlined" onClick={onChangeSoonwon}>
              받은 사람
            </Button>
          </Box>
          <Box sx={{width: "200px"}}>{soonwon.nickname}</Box>
          <HistoryCampusDialog
            open={SoonwonOpen}
            setOpen={setSoonwonOpen}
            users={userList}
            selectedUsers={selectedUsers}
            handleUser={handleSoonwon}
          />
        </Box>
        <Box className="row">
          <Box className="header">날짜</Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              inputFormat="MM/DD/YYYY"
              value={date}
              onChange={handleDateChange}
              renderInput={params => <TextField size="small" {...params} />}
            />
          </LocalizationProvider>
        </Box>
        <Box className="row">
          <Box className="header">내용</Box>
          <Box>
            <TextField size="small" multiline rows={4} {...register("contents")} />
          </Box>
        </Box>
        <Box sx={{marginTop: "5px"}}>
          <Box className="header" sx={{textAlign: "left!important"}}>
            기도 제목
          </Box>
        </Box>
        <Box>
          <Box>
            {prayers.map((value, index) => (
              <Box key={index} sx={{display: "flex", alignItems: "center", padding: "2px 0"}}>
                <TextField
                  size="small"
                  sx={{mr: 2}}
                  value={value.pray}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => handlePrayerFieldChange(event, index)}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value.publicyn === "Y" ? true : false}
                      onChange={event => handlPublicynChange(event, index)}
                      name={`publicyn-${index}`}
                    />
                  }
                  label="공개"
                />
                <RemoveCircleOutlineIcon onClick={() => handleDeletePrayerField(index)} />
              </Box>
            ))}
          </Box>
        </Box>
        <Button variant="outlined" fullWidth onClick={handleAddPrayerField}>
          기도제목 추가
        </Button>
        <HistoryCampusDialog open={SoonwonOpen} setOpen={setSoonwonOpen} users={userList} selectedUsers={selectedUsers} handleUser={handleSoonwon} />
      </Box>
      <Box className="row">
        <Box>
          <Button ref={ref} variant="outlined" type="submit" sx={{display: "none"}}>
            저장
          </Button>
        </Box>
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
