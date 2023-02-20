import {ChangeEvent, useEffect, useState, useRef, forwardRef} from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
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
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import Loading from "react-loading";
import Error from "components/Error/Error";
import HistoryCampusDialog from "./modal/HistoryCampusDialog";
import {getCampusUserByUserIdQuery} from "@recoils/campus/query";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {getTitle} from "@layout/header/HeaderConstants";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {useRecoilState, useRecoilValue} from "recoil";
import {userState} from "@recoils/user/state";
import {selectedCampusState} from "@recoils/campus/state";
import CampusDialog from "@pages/MyProfile/modal/CampusDialog";
import {categoryState} from "@recoils/history/state";
import {HistoryForm, Prayer, User} from "@recoils/types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {postSoonHistory} from "@recoils/history/axios";
import HistoryCampusDialogMulti from "./modal/HistoryCampusDialogMulti";

//받은 사람 명단 수정해야 함.
/*
  0. 캠퍼스 선택해서 userList 하지말고, 모두 가져와서 dialog에서 캠퍼스별로 구분 해야 함.....
  1. "순장이 가진" 전체 캠퍼스의 사용자 명단 보여줄 것
  2. 선택 할 수 없는 사람 disabled 할 것
  3. 선택된 사람들 checkbox로 표기
  4. 다른캠퍼스소속의 내 순원도 선택 할 수 있어야 함.(여러명 순모임)
*/

// 순장 바뀌면 순원 바뀌게
export default function HistoryWrite() {
  const ref = useRef(null);
  const campusRef = useRef(null);
  const loginUser: any = useRecoilValue(userState);
  const [campusid, setCampusid] = useState(loginUser?.campus[0]?.campusid);
  const [campusList, setCampusList] = useState([]);
  // const [campus, setCampus]: any = useRecoilState(selectedCampusState);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const list = loginUser?.campus?.map(({campus}: any) => campus);
    setCampusList(list);
    // if (campus == null && list?.length > 0) {
    // setCampus(list[0]);
    // }
  }, [loginUser]);

  //forwarRef로 초기화 하는거 만들어서, 안에서 클릭할 버튼을 만들고, 실제 이벤트는 initRef/fowardRef  , init 이벤트 초기화 ㄱㄱ
  const SubmitButton = forwardRef((props: any, ref: any) => {
    return (
      <Button ref={ref} variant="outlined" type="submit" sx={{display: "none"}}>
        {/* <Button ref={ref} variant="outlined" type="submit"> */}
        submit 저장
      </Button>
    );
  });
  const InitButton = forwardRef((props: any, ref: any) => {
    return (
      <Button
        ref={ref}
        variant="outlined"
        onClick={() => {
          props?.onClick(props?.campusid);
        }}
        sx={{display: "none"}}>
        Init 버튼
      </Button>
    );
  });

  const onConfirm = () => {
    console.log("HistoryWrite onConfirm >");
    const target: any = ref.current;
    target?.click();
  };

  return (
    <>
      <MyHeader onConfirm={onConfirm} />

      <HistoryWriteContents
        SubmitButton={<SubmitButton ref={ref} />}
        InitButton={(handleClick: any) => <InitButton ref={campusRef} onClick={handleClick} />}
        userid={loginUser?.userid}
      />
    </>
  );
}
// 순장 선택하면, 캠퍼스 유저 갱신, useeffect
function HistoryWriteContents({SubmitButton, InitButton, userid}: any) {
  const {historyid} = useParams();
  const navigate = useNavigate();
  const {isLoading, isError, data, error, refetch} = getCampusUserByUserIdQuery(userid);
  const loginUser: any = useRecoilValue(userState);
  const categoryList = useRecoilValue(categoryState);

  const {register, handleSubmit, setValue} = useForm<HistoryForm>(); // user
  const [SoonwonOpen, setSoonwonOpen]: any = useState(false);
  const [SoonjangOpen, setSoonjangOpen]: any = useState(false);
  const [date, setDate]: any = useState(new Date());
  const [categorySelected, setCategorySelected]: any = useState({id: "soon", name: "순모임"});
  const [prayers, setPrayers] = useState<Prayer[]>([{pray: "", publicyn: "Y"}]);
  //순장은 현재 내가 가지고 있는 캠퍼스의 유저 id로 가져온다. 나랑 같은 캠퍼스
  // 순원은 부모 campus id를 가지고, 가져와서 뿌려줘야 한다.

  //FIXME: 해주는 사람과 받는 사람이 일단 단일이니까, 한명씩으로 구현, 추후 인원 늘리면 수정 바람
  const [soonjang, setSoonjang] = useState<User>({userid: loginUser?.userid, nickname: loginUser?.nickname});
  const [soonwon, setSoonwon] = useState<User[]>([]);
  const [progress, setProgress] = useState("");
  const [contents, setContents] = useState("");
  //선택 된 유저는 공통 관리
  const [selectedUsers, setSeletedUsers] = useState<User[]>([]);
  const [selectedSoonjang, setSeletedSoonjang] = useState<User>(soonjang);
  useEffect(() => {
    refetch();
    console.log("getCampusUserByUserIdQuery : ", data);
  }, [data, userid]);

  if (isLoading) return <Loading />;
  if (isError) {
    console.log("isError >>", isError, error);
    return <Error error={error} />;
  }

  const onChangeSoonjang = (e: any) => {
    setSoonjangOpen(true);
  };
  const onChangeSoonwon = (e: any) => {
    setSoonwonOpen(true);
  };

  const handleSoonjang = (newSoonjang: User) => {
    setSoonjang(newSoonjang);
    setSeletedSoonjang(newSoonjang);
    setSeletedUsers([]);
    setSoonwon([])
  };
  const handleSoonwon = (newSoonwon: any[]) => {
    setSoonwon(newSoonwon);
    setSeletedUsers([...newSoonwon]);
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
  const handleCategoryReceive = (event: any) => {
    const value = event.target.value;
    console.log("value >", value);
    setCategorySelected(value);
  };
  //error 처리....
  const sendHistory: SubmitHandler<HistoryForm> = async (params: HistoryForm) => {
    console.log("순장 순원 ", soonjang, soonwon);
    //FIXME: soonjang/soonwon id 디폴트 값 0 이라 예외처리 함. 추후 모달 창이나, 백에서 처리하도록 수정 바람
    if (soonjang == null || soonwon?.length == 0) {
      alert("순장/순원 선택 바랍니다");
      return;
    }
    params.kind = categorySelected?.id;
    params.historydate = new Date(dayjs(date).format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"));
    params.prays = prayers;
    params.sjid = soonjang?.userid;
    //FIXME: 순원 ids 추가 바람
    params.swids = [];

    const result = await postSoonHistory(params);
    if (result) {
      alert("순 히스토리 쓰기 완료!");
      navigate("/");
    } else {
      console.log("SERVER에서 응답하지 않습니다");
    }
  };
  const userList: any = data;

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(sendHistory)}
        sx={[
          historyid ? styles.mobile.container : styles.web.container,
          styles.web.writeform,
          {
            ".row": {display: "flex", alignItems: "center", marginTop: "5px"},
            ".header": {minWidth: "95px", textAlign: "right", paddingRight: "10px", fontSize: "16px"},
            ".value": {width: "100%"},
          },
        ]}>
        <Box className="row">
          <Box className="header">
            <Button variant="outlined" onClick={onChangeSoonjang}>
              순장선택
            </Button>
          </Box>
          <Box className="value">
            <TextField size="small" fullWidth value={soonjang.nickname} InputProps={{readOnly: true}} />
          </Box>
          <HistoryCampusDialog
            open={SoonjangOpen}
            setOpen={setSoonjangOpen}
            users={userList}
            selectedSoonjang={selectedSoonjang}
            handleUser={handleSoonjang}
          />
        </Box>
        <Box className="row">
          {/* 선택방법.. 분류 종류 */}
          <Box className="header">분류</Box>
          <Box className="value">
            <Select size="small" value={categorySelected} fullWidth onChange={handleCategoryReceive} renderValue={(selected: any) => selected?.name}>
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
          <Box className="value">
            <TextField
              size="small"
              fullWidth
              {...register("progress", {required: true})}
              value={progress}
              onChange={(e: any) => {
                setProgress(e.target.value);
              }}
            />
          </Box>
        </Box>
        <Box className="row">
          {/* 선택방법.. 사용자 선택 */}
          <Box className="header">
            <Button variant="outlined" onClick={onChangeSoonwon}>
              받은 사람
            </Button>
          </Box>
          <Box className="value">
            <TextField fullWidth size="small" value={soonwon.map(({nickname}: any) => nickname).join(", ")} InputProps={{readOnly: true}} />
          </Box>
          <HistoryCampusDialogMulti
            open={SoonwonOpen}
            setOpen={setSoonwonOpen}
            soonjang={soonjang}
            selectedUsers={selectedUsers}
            handleUser={handleSoonwon}
          />
        </Box>
        <Box className="row">
          <Box className="header">날짜</Box>
          <Box sx={{width: "100%"}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                inputFormat="MM/DD/YYYY"
                value={date}
                onChange={handleDateChange}
                renderInput={params => <TextField fullWidth size="small" {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </Box>
        <Box className="row">
          <Box className="header">내용</Box>
          <Box className="value">
            <TextField
              size="small"
              fullWidth
              multiline
              rows={4}
              {...register("contents", {required: true})}
              value={contents}
              onChange={(e: any) => {
                setContents(e.target.value);
              }}
            />
          </Box>
        </Box>
        <Box className="row">
          <Box className="header">기도 제목</Box>
          <Box className="value">
            {prayers.map((value, index) => (
              <Box key={index} sx={{display: "flex", alignItems: "center", padding: "2px 0"}}>
                <TextField
                  size="small"
                  fullWidth
                  value={value.pray}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => handlePrayerFieldChange(event, index)}
                  required={true}
                />
                <Box sx={{display: "flex", alignItems: "center", minWidth: "105px", marginLeft: "10px"}}>
                  <FormControlLabel
                    sx={{minWidth: "75px"}}
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
              </Box>
            ))}
          </Box>
        </Box>
        <Button variant="outlined" fullWidth onClick={handleAddPrayerField}>
          기도제목 추가
        </Button>

        {SubmitButton}
        {InitButton()}
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
