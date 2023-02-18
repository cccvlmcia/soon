import {useEffect, useState, useRef, forwardRef} from "react";
import {Box, TextField, Select, MenuItem, Button, Checkbox, ListItemText, AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import {useForm, SubmitHandler} from "react-hook-form";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {styles} from "@layout/styles";
import {api} from "@recoils/constants";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import Loading from "react-loading";
import Error from "components/Error/Error";
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
import {getSoonHistoryQuery} from "@recoils/soon/query";

export default function HistoryWrite() {
  const ref = useRef(null);
  const campusRef = useRef(null);
  const loginUser: any = useRecoilValue(userState);
  const [campusid, setCampusid] = useState(loginUser?.campus[0]?.campusid);
  const [campusList, setCampusList] = useState([]);
  const [campus, setCampus]: any = useRecoilState(selectedCampusState);
  const [open, setOpen] = useState(false);
  //forwarRef로 초기화 하는거 만들어서, 안에서 클릭할 버튼을 만들고, 실제 이벤트는 initRef/fowardRef  , init 이벤트 초기화 ㄱㄱ
  const SubmitButton = forwardRef((props: any, ref: any) => {
    return (
      <Button ref={ref} variant="outlined" type="submit" sx={{display: "none"}}>
        submit 저장
      </Button>
    );
  });
  useEffect(() => {
    const list = loginUser?.campus?.map(({campus}: any) => campus);
    setCampusList(list);
    if (campus == null && list?.length > 0) {
      setCampus(list[0]);
    }
  }, [loginUser, campus]);

  const handleCampus = (campus: any) => {
    initHistoryForm(campus);
    setCampus(campus);
    setCampusid(campus?.campusid);
  };

  const onConfirm = () => {
    const target: any = ref.current;
    target?.click();
  };

  const initHistoryForm = (campus: any) => {
    console.log("캠퍼스를 변경했으므로 폼을 초기화 합니다", campus, campus?.campusid);
    const target: any = campusRef.current;
    target?.click();
  };

  return (
    <>
      <MyHeader onConfirm={onConfirm} />
      <Box sx={{textAlign: "center", fontSize: "20px", padding: "20px 0", borderBottom: "1px solid gray"}}>
        <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
          <Box>{campus?.name}</Box>
        </Box>
      </Box>

      <HistoryWriteContents SubmitButton={<SubmitButton ref={ref} />} campus={campus} />
      <CampusDialog open={open} setOpen={setOpen} items={campusList} campusSelected={campus} handleCampus={handleCampus} />
    </>
  );
}

function HistoryWriteContents({SubmitButton, campus}: any) {
  const categoryList = useRecoilValue(categoryState);
  const {historyid} = useParams();
  const navigate = useNavigate();
  const {isLoading, isError, data, error} = getSoonHistoryQuery(Number(historyid));

  const {register, handleSubmit, setValue} = useForm<HistoryForm>(); // user

  //FIXME: 해주는 사람과 받는 사람이 일단 단일이니까, 한명씩으로 구현, 추후 인원 늘리면 수정 바람
  // {userid: loginUser?.userid, nickname: loginUser?.nickname}
  const [soonjang, setSoonjang]: any = useState(null);
  const [soonwon, setSoonwon]: any = useState(null);
  const [progress, setProgress]: any = useState("");
  const [contents, setContents]: any = useState("");
  const [date, setDate]: any = useState(null);
  const [categorySelected, setCategorySelected]: any = useState("");

  useEffect(() => {
    if (data != null) {
      setSoonjang(data?.soonjang);
      setSoonwon(data?.soonwon);
      setProgress(data?.progress);
      setContents(data?.contents);
      const category = categoryList?.find((c: any) => c?.id == data?.kind) || {id: "soon", name: "순모임"};
      setCategorySelected(category);
      setDate(dayjs(data?.historydate).format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"));
    }
  }, [data]);

  if (isLoading) return <Loading />;
  if (isError) return <Error error={error} />;

  if (progress) setValue("progress", progress);
  if (contents) setValue("contents", contents);

  const handleDateChange = (newValue: Dayjs | null) => setDate(newValue);

  const handleCategoryReceive = (event: any) => {
    const value = event.target.value;
    console.log("value >", value);
    setCategorySelected(value);
  };
  //error 처리....
  const sendHistory: SubmitHandler<HistoryForm> = async (params: HistoryForm) => {
    console.log("순장 순원 ", soonjang, soonwon);
    //FIXME: soonjang/soonwon id 디폴트 값 0 이라 예외처리 함. 추후 모달 창이나, 백에서 처리하도록 수정 바람
    if (soonjang?.userid == "0" || soonwon?.userid == "0") {
      alert("순장/순원 선택 바랍니다");
      return;
    }
    params.kind = categorySelected?.id;
    params.historydate = new Date(dayjs(date).format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"));
    params.sjid = soonjang?.userid || "";
    params.swid = soonwon?.userid || "";

    console.log("params >>", params);

    //*
    const result = await api.put(`soon/history/${historyid}`, params);
    if (result) {
      alert("순 히스토리 수정 완료!");
      navigate("/");
    } else {
      console.log("SERVER에서 응답하지 않습니다");
    }
    // */
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(sendHistory)}
        sx={[
          styles.web.container,
          styles.web.writeform,
          {
            ".row": {display: "flex", alignItems: "center", marginTop: "5px"},
            ".header": {minWidth: "95px", textAlign: "right", paddingRight: "10px", fontSize: "16px"},
            ".value": {width: "100%"},
          },
        ]}>
        <Box className="row">
          <Box className="header">순장</Box>
          <Box className="value">
            <TextField size="small" fullWidth value={soonjang?.nickname} InputProps={{readOnly: true}} />
          </Box>
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
              {...register("progress")}
              value={progress}
              onChange={(e: any) => {
                setProgress(e.target.value);
              }}
            />
          </Box>
        </Box>
        <Box className="row">
          {/* 선택방법.. 사용자 선택 */}
          <Box className="header">받은 사람</Box>
          <Box className="value">
            <TextField fullWidth size="small" value={soonwon?.nickname} InputProps={{readOnly: true}} />
          </Box>
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
              {...register("contents")}
              value={contents}
              onChange={(e: any) => {
                setContents(e.target.value);
              }}
            />
          </Box>
        </Box>
        {/* 기도 추가?! */}
        {SubmitButton}
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
