import {Box, List, ListItemButton, ListItemText, Select, MenuItem} from "@mui/material";

import {getSoonHistorySJListQuery, getSoonHistorySWListQuery} from "@recoils/soon/query";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";
import {Typography} from "@material-ui/core";
import {useSearchParams, useNavigate, useParams} from "react-router-dom";
import {format} from "date-fns";
import NoData from "components/common/NoData";
import {getUserInfoQuery} from "@recoils/user/query";
const avatar =
  "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20150403_67%2Fe2voo_14280514292377Sadp_JPEG%2Fkakako-03.jpg&type=a340";

function SoonCardHeader({nickname, major, sid, campusList}: any) {
  const items = campusList?.map((campus: any) => (
    <option key={campus?.campusid} selected value={campus?.campusid}>
      {campus?.name}
    </option>
  ));
  return (
    <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
      <Box sx={{marginTop: "5px"}} component={"img"} src={avatar}></Box>
      <Box sx={{width: "340px", marginTop: "10px"}}>
        <Select fullWidth native size="small">
          {items}
        </Select>
        <Box>
          <Typography variant="body1">이름: {nickname}</Typography>
        </Box>
        <Box>{major && <Typography variant="body1">전공: {major}</Typography>}</Box>
        <Box>{sid && <Typography variant="body1">학번: {sid}</Typography>}</Box>
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
    <Box>
      <SoonCardHeader nickname={data?.nickname} major={campus.major} sid={campus?.sid} campusList={campusList} />
      <Box>
        <Box sx={{border: "1px solid black", textAlign: "center", padding: "20px"}}>받은 순모임 히스토리</Box>
        <SoonHistorySW swid={userid} />
      </Box>
      <Box>
        <Box sx={{border: "1px solid black", textAlign: "center", padding: "20px"}}>해준 순모임 히스토리</Box>

        <SoonHistorySJ sjid={userid} />
      </Box>
    </Box>
  );
}
/*
  soon = "soon", //순모임
  coffee = "coffee", //커피타임
  activity = "activity", //외부활동
  unity = "unity", //연합 순모임
*/
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
    <ListItemButton onClick={() => navigate(`/history/${historyid}/view`)}>
      <ListItemText primary={`${dateStr} [${type[kind]}] ${progress}`} secondary={user?.nickname} />
    </ListItemButton>
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
  const soonHistorySJ = data?.map(({historyid, soonwon, kind, progress, historydate}: any) => (
    <SoonHistoryCard key={historyid} historyid={historyid} user={soonwon} kind={kind} progress={progress} historydate={historydate} />
  ));
  return (
    <>
      {data.length > 0 && <List>{soonHistorySJ}</List>}
      {data.length == 0 && <NoData />}
    </>
  );
}
