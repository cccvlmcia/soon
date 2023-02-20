import {Box, List, ListItemButton, ListItemText, Select, MenuItem} from "@mui/material";
import {getSoonHistorySJListQuery, getSoonHistorySWListQuery} from "@recoils/soon/query";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";
import {Typography} from "@material-ui/core";
import {useNavigate, useParams} from "react-router-dom";
import {format} from "date-fns";
import NoData from "@common/NoData";
import {getUserInfoQuery} from "@recoils/user/query";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function SoonCardHeader({nickname, major, sid, campusList}: any) {
  const items = campusList?.map((campus: any) => (
    <option key={campus?.campusid} value={campus?.campusid}>
      {campus?.name}
    </option>
  ));
  return (
    <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", marginBottom: "50px"}}>
      <Box sx={{width: "340px", margin: "10px", div: {marginTop: "10px"}}}>
        <Select fullWidth native size="small">
          {items}
        </Select>
      </Box>
      {/* <Box sx={{marginTop: "40px", borderRadius: "50%", width: "100px"}} component={"img"} src={avatar}></Box> */}
      <AccountCircleIcon sx={{width: 80, height: 80, opacity: "0.5"}} />
      <Box sx={{textAlign: "center"}}>
        {nickname} {sid} <Box sx={{opacity: "0.5"}}>{major}</Box>
      </Box>
    </Box>
  );
}

export default function SoonCard() {
  const params = useParams();
  const userid = Number(params?.userid) || 0;
  const {isLoading, isError, data, error} = getUserInfoQuery(userid);
  const campusList = data?.campus?.map(({campus}: any) => campus);
  const campus = data?.campus[0];
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  return (
    <Box sx={{display: "flex", flexDirection: "column", gap: "5px"}}>
      <SoonCardHeader nickname={data?.nickname} major={campus?.major} sid={campus?.sid} campusList={campusList} />
      <Box sx={{">div": {background: "#F7F9FA", padding: "10px 20px", fontWeight: "700"}}}>
        <Box>받은 순모임 히스토리</Box>
        <SoonHistorySW swid={userid} />
      </Box>
      <Box sx={{">div": {background: "#F7F9FA", padding: "10px 20px", fontWeight: "700"}}}>
        <Box>해준 순모임 히스토리</Box>
        <SoonHistorySJ sjid={userid} />
      </Box>
    </Box>
  );
}
const type: any = {
  soon: "순모임",
  coffee: "커피타임",
  activity: "외부활동",
  unity: "연합 순모임",
};
function SoonHistoryCard({historyid, user, kind, progress, historydate}: any) {
  const navigate = useNavigate();
  const dateStr = format(new Date(historydate), "MM-dd hh:mm");
  return (
    <Box
      onClick={() => navigate(`/history/${historyid}`)}
      sx={{display: "flex", justifyContent: "space-between", margin: "8px 20px", fontWeight: "300"}}>
      <Box sx={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>{`[${type[kind]}] ${progress}`}</Box>
      <Box sx={{display: "flex", flexDirection: "column", opacity: "0.5"}}>
        <Box
          sx={{
            display: "-webkit-box",
            whiteSpace: "initial",
            WebkitBoxOrient: "vertical",
            maxWidth: "170px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitLineClamp: 1,
            textAlign: "right",
          }}>
          <Box>{user?.nickname}</Box>
        </Box>
        <Box sx={{display: "flex", alignItems: "center", fontSize: "10px", justifyContent: "right"}}>
          <AccessTimeIcon sx={{fontSize: "10px", margin: "2.5px 2px 0 0"}} />
          {dateStr}
        </Box>
      </Box>
    </Box>
  );
}

function SoonHistorySW({swid}: any) {
  const {isLoading, isError, data, error} = getSoonHistorySWListQuery(swid);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  //TODO: id => nickname
  const soonHistorySW = data?.map(({historyid, soonjang, soonwon, kind, progress, historydate}: any) => (
    <SoonHistoryCard key={historyid} historyid={historyid} user={soonjang} kind={kind} progress={progress} historydate={historydate} />
  ));
  return (
    <>
      {data.length > 0 && <List>{soonHistorySW}</List>}
      {data.length == 0 && <NoData />}
    </>
  );
}

function SoonHistorySJ({sjid}: any) {
  const {isLoading, isError, data, error} = getSoonHistorySJListQuery(sjid);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  //TODO: id => nickname
  const soonHistorySJ = data?.map(({historyid, users, kind, progress, historydate}: any) => {
    const user = {nickname: users?.map(({nickname}: any) => nickname).join(", ")};
    return <SoonHistoryCard key={historyid} historyid={historyid} user={user} kind={kind} progress={progress} historydate={historydate} />;
  });
  return (
    <>
      {data.length > 0 && <List>{soonHistorySJ}</List>}
      {data.length == 0 && <NoData />}
    </>
  );
}
