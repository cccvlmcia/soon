import {useEffect, useState, useRef, forwardRef} from "react";
import {Box, TextField, Select, MenuItem, Button, SelectChangeEvent, Checkbox, ListItemText, FormControlLabel} from "@mui/material";
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
import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import {getTitle} from "@layout/header/HeaderConstants";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {useRecoilState, useRecoilValue} from "recoil";
import {userState} from "@recoils/user/state";
import {selectedCampusState} from "@recoils/campus/state";
import CampusDialog from "@pages/MyProfile/modal/CampusDialog";

import {categoryState} from "@recoils/history/state";
import {getSoonHistoryQuery} from "@recoils/soon/query";
import {HistoryEditForm, Prayer, User} from "@recoils/types";

export default function HistoryEdit() {
  const ref = useRef(null);
  const loginUser: any = useRecoilValue(userState);
  const [campusid, setCampusid] = useState(loginUser?.campus[0]?.campusid);
  const [campusList, setCampusList] = useState([]);
  const [campus, setCampus]: any = useRecoilState(selectedCampusState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const list = loginUser?.campus?.map(({campus}: any) => campus);
    setCampusList(list);
    if (campus == null && list?.length > 0) {
      setCampus(list[0]);
    }
  }, [loginUser]);

  const SubmitButton = forwardRef((props: any, ref: any) => {
    return (
      <Button ref={ref} variant="outlined" type="submit" sx={{display: "none"}}>
        저장
      </Button>
    );
  });

  const handleCampus = (campus: any) => {
    setCampus(campus);
    setCampusid(campus?.campusid);
  };

  const onConfirm = () => {
    console.log("onConfirm >");
    const target: any = ref.current;
    target?.click();
  };

  return (
    <>
      <MyHeader onConfirm={onConfirm} />
      <Box sx={{textAlign: "center"}}>
        <Button fullWidth variant="outlined" onClick={() => setOpen(true)}>
          {campus?.name}
        </Button>
      </Box>
      <HistoryWriteContents SubmitButton={<SubmitButton ref={ref} />} campusid={campusid} />
      <CampusDialog open={open} setOpen={setOpen} items={campusList} campusSelected={campus} handleCampus={handleCampus} />
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
function HistoryWriteContents({SubmitButton, campusid}: any) {
  const {register, handleSubmit} = useForm<HistoryEditForm>(); // user

  const {historyid} = useParams();
  const navigate = useNavigate();
  const [SoonwonOpen, setSoonwonOpen]: any = useState(false);
  const [SoonjangOpen, setSoonjangOpen]: any = useState(false);
  const categoryList = useRecoilValue(categoryState);

  const {isLoading, isError, data, error, refetch} = getCampusUserQuery(campusid);
  const {isLoading: historyIsLoading, isError: historyIsError, data: historyData, error: historyError} = getSoonHistoryQuery(Number(historyid));
  // dayjs(date).format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
  const [date, setDate]: any = useState(new Date(dayjs(historyData?.historydate).format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")));
  const [userList, setUserList] = useState<User[]>([]);
  const [categorySelected, setCategorySelected]: any = useState(null);
  // FIXME: prays 못가져오는 듯
  const [prayers, setPrayers] = useState<Prayer[]>(historyData?.prays);

  //선택 된 유저는 공통 관리
  const [selectedUsers, setSeletedUsers] = useState<User[]>([]);
  //FIXME: 해주는 사람과 받는 사람이 일단 단일이니까, 한명씩으로 구현, 추후 인원 늘리면 수정 바람
  const [soonjang, setSoonjang] = useState<User>(historyData?.soonjang);
  const [soonwon, setSoonwon] = useState<User>(historyData?.soonwon);

  useEffect(() => {
    refetch();
  }, [campusid]);
  useEffect(() => {
    if (data && historyData) {
      userListFunc();
    }
  }, [data, historyData, historyid, soonjang, soonwon]);

  if (isLoading || historyIsLoading) return <Loading />;
  if (isError || historyIsError) return <Error error={error} />;

  const onChangeSoonjang = (e: any) => {
    setSoonjangOpen(true);
  };
  const onChangeSoonwon = (e: any) => {
    setSoonwonOpen(true);
  };

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

  const handleCategoryReceive = (event: SelectChangeEvent<never>) => {
    const value = event.target.value;
    setCategorySelected(value);
  };
  //error 처리....
  const sendHistory: SubmitHandler<HistoryEditForm> = async (params: HistoryEditForm) => {
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

    params.sjid = soonjang.userid;
    params.swid = soonwon.userid;

    console.log("params >> ", params);
    const result = await api.put(`soon/history/${historyid}`, params);
    if (result) {
      alert("순 히스토리 쓰기 완료!");
      navigate("/");
    } else {
      console.log("SERVER에서 응답하지 않습니다");
    }
  };

  const userListFunc = () => {
    const userList: User[] = data?.map(({user}: {user: User}) => {
      return {userid: user.userid, nickname: user?.nickname};
    });
    setUserList(userList || []);
  };
  console.log("categorySelected >", categorySelected);
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
            ".header": {width: "120px", textAlign: "right", paddingRight: "10px", fontSize: "16px"},
          },
        ]}>
        <Box className="row">
          <Box className="header">
            <Button variant="outlined" onClick={onChangeSoonjang}>
              순장선택
            </Button>
          </Box>
          <Box sx={{width: "200px"}}>{soonjang?.nickname}</Box>
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
            <TextField size="small" defaultValue={historyData.progress} {...register("progress", {required: true})} />
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
          <Box sx={{width: "200px"}}>{soonwon?.nickname}</Box>
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
              inputFormat="YYYY/MM/DD/"
              value={date}
              onChange={handleDateChange}
              renderInput={params => <TextField size="small" {...params} />}
            />
          </LocalizationProvider>
        </Box>
        <Box className="row">
          <Box className="header">내용</Box>
          <Box>
            <TextField size="small" defaultValue={historyData?.contents} multiline rows={4} {...register("contents", {required: true})} />
          </Box>
        </Box>

        <HistoryCampusDialog open={SoonwonOpen} setOpen={setSoonwonOpen} users={userList} selectedUsers={selectedUsers} handleUser={handleSoonwon} />
        {SubmitButton}
      </Box>
    </>
  );
}
