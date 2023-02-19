import {useState, useEffect} from "react";
import {styles} from "@layout/styles";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Box} from "@mui/material";
import {getSoonHistoryQuery} from "@recoils/soon/query";
import {userState} from "@recoils/user/state";
import Error from "components/Error/Error";
import Loading from "components/Loading/Loading";
import {useRecoilValue} from "recoil";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import IconButton from "@mui/material/IconButton";
import {api} from "@recoils/constants";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {format} from "date-fns";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NoData from "components/common/NoData";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Typography from "@mui/material/Typography";
import {getTitle} from "@layout/header/HeaderConstants";
import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import {deleteSoonPray} from "@recoils/history/axios";
const type: any = {
  soon: "순모임",
  coffee: "커피타임",
  activity: "외부활동",
  unity: "연합 순모임",
};

export default function HistoryContents() {
  const {historyid} = useParams();
  const {isLoading, isError, data, error, refetch} = getSoonHistoryQuery(Number(historyid));
  const loginUser: any = useRecoilValue(userState);
  const [prays, setPrays]: any = useState([]);
  useEffect(() => {
    if (data) {
      setPrays(data?.prays);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  //  const  config  =loginUser?.config?.userid === data.swid || loginUser?.config?.userid === data.sjid)
  // let prays: Prayer[] = data?.prays;
  const isSoonjang = loginUser?.config?.userid === data.sjid;
  const isSoonwon = loginUser?.config?.userid === data.swid;
  const hasPrayAuth = isSoonjang || isSoonwon;
  // if (!hasPrayAuth) {
  //   setPrays(prays?.filter((pray: any) => ));
  // }

  const handlePrayRemove = async (prayid: number) => {
    const {data} = await deleteSoonPray(prayid);
    if (data?.affected > 0) {
      alert(" 기도가 삭제 되었습니다!");
      refetch();
    }
  };
  const prayList = hasPrayAuth ? prays : prays?.filter((pray: any) => pray.publicyn == "Y");
  const prayView = prayList?.map(({prayid, pray}: any) => (
    <ListItemButton dense={true} key={prayid} sx={{display: "flex"}}>
      <ListItem>
        <ListItemText>{pray}</ListItemText>
        {hasPrayAuth && (
          <IconButton onClick={() => handlePrayRemove(prayid)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        )}
      </ListItem>
    </ListItemButton>
  ));

  return (
    <>
      <MyHeader hasAuth={hasPrayAuth} />
      <Box
        sx={[
          historyid ? styles.mobile.container : styles.web.container,
          styles.web.writeform,
          {
            marginTop: "40px",
            ".row": {display: "flex", alignItems: "center", marginTop: "5px", width: "100%"},
            ".header": {width: "70px", textAlign: "left", padding: "0 10px 0 40px", fontSize: "16px"},
            ".value": {width: "calc(100% - 120px - 20px)", paddingRight: "20px"},
          },
          {width: "100%"},
        ]}>
        <Box sx={{paddingLeft: "20px", display: "flex", gap: 1, borderBottom: "1px solid gray"}}>
          <Box sx={{textAlign: "center"}}>
            <AccountCircleIcon sx={{width: 80, height: 80, opacity: "0.5"}} />
            <Box>{data?.soonwon?.nickname}</Box>
          </Box>
          <Box sx={{display: "flex", flexDirection: "column", fontSize: "20px"}}>
            {/* <Box sx={{opacity: "0.5"}}> */}
            <Box sx={{display: "flex", flexDirection: "column"}}>
              <Box>
                [{type[data?.kind]}] {data?.progress}
              </Box>
            </Box>
            <Box sx={{marginTop: "auto", opacity: "0.5", fontSize: "16px"}}>
              <Box>순장: {data?.soonjang?.nickname}</Box>
              <Box sx={{display: "flex", alignItems: "center"}}>
                <AccessTimeIcon sx={{fontSize: "18px", margin: "2.5px 2px 0 0"}} />
                {format(new Date(data?.historydate), "MM-dd hh:mm")}
              </Box>
            </Box>
          </Box>
        </Box>
        {hasPrayAuth && <Box sx={{padding: "20px", wordBreak: "break-all"}}>{data?.contents}</Box>}
        <Box className="row" sx={{flexDirection: "column", marginTop: "0!important"}}>
          <Box sx={{background: "#F7F9FA", fontWeight: "700", width: "100%!important"}}>
            <Box sx={{padding: "10px 20px"}}>기도제목</Box>
          </Box>
          {prayList?.length > 0 && (
            <Box sx={{width: "100%"}}>
              <List>{prayView}</List>
            </Box>
          )}
          {prayList?.length == 0 && <NoData />}
        </Box>
      </Box>
    </>
  );
}

function MyHeader({hasAuth}: any) {
  const {pathname} = useLocation();
  const {historyid} = useParams();
  const navigate = useNavigate();
  const handlePrev = () => {
    navigate(-1);
  };
  const onClickEdit = () => {
    if (historyid) {
      navigate(`/history/${historyid}/edit`);
    }
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
          {/*  순장이나 순원만 수정가능 */}
          {hasAuth && (
            <IconButton edge="end" color="inherit" onClick={onClickEdit} aria-label="close">
              <EditIcon color="secondary" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}
