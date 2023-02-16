import {Box, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {getUserInfoQuery} from "@recoils/api/User";
import {getSoonHistorySJListQuery, getSoonHistorySWListQuery} from "@recoils/api/Soon";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";
import {makeStyles, Typography} from "@material-ui/core";
import {useSearchParams, useNavigate, useParams} from "react-router-dom";
import {format} from "date-fns";
import NoData from "components/common/NoData";

const soonHeaderStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
  },
  media: {
    height: 300,
  },
});
const avatar =
  "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20150403_67%2Fe2voo_14280514292377Sadp_JPEG%2Fkakako-03.jpg&type=a340";

function SoonCardHeader({nickname, major, sid}: any) {
  const classes = soonHeaderStyles();
  return (
    <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
      <Box component={"img"} src={avatar}></Box>
      <Box sx={{width: "340px", marginTop: "10px"}}>
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
  const [searchParams] = useSearchParams();
  const id = searchParams?.get("id");

  const userid = Number(params?.userid) || 0;
  console.log("userid >", userid, id);
  const {isLoading, isError, data, error} = getUserInfoQuery(userid);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  return (
    <Box>
      <SoonCardHeader nickname={data?.nickname} major={data?.campus[0]?.major} sid={data?.campus[0]?.sid} />
      <Box>
        <Box sx={{border: "1px solid black", textAlign: "center", padding: "20px"}}>받은 순모임 히스토리</Box>
        <SoonHistorySW swid={userid} />
      </Box>
      <Box>
        <Box sx={{border: "1px solid black", textAlign: "center", padding: "20px"}}>해준 순모임 히스토리</Box>

        {/*권한 있어야 조회 가능*/}
        <SoonHistorySJ sjid={userid} />
        {/*권한 있어야 조회 가능*/}
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
