import {Box} from "@mui/material";
import { getUserInfoQuery } from "@recoils/api/User";
import {getSoonHistorySJListQuery, getSoonHistorySWListQuery} from "@recoils/api/Soon"
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";
import { Card, CardContent, makeStyles, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const soonHeaderStyles = makeStyles({
  root: {
    width: 500,
    height: 50,
    display: "flex",
    flexDirection: "row",
  },
});

function SoonCardHeader({nickname, major, sid}: any) {
  const classes = soonHeaderStyles();
  return (
  <Card className={classes.root}>
    <CardContent>
      <Typography variant="h5">{nickname} | {major} | {sid}</Typography>
    </CardContent>
  </Card>
  );
}

export default function SoonCard() {
  const urlParams = new URL(location.href).searchParams;
  const userid = Number(urlParams.get("id"));
  const {isLoading, isError, data, error} = getUserInfoQuery(userid)
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  } 
  return(
  <Box>
    <SoonCardHeader nickname={data?.nickname} major={data?.campus[0]?.major} sid={data?.campus[0]?.sid}/>
    <Box>
      <Box>받은 순모임 히스토리</Box>
      <SoonHistorySW swid={userid} />
    </Box>
    <Box>
      <Box>해준 순모임 히스토리</Box>
      {/*권한 있어야 조회 가능*/}
      {/* <SoonHistorySJ sjid={userid} /> */}
      {/*권한 있어야 조회 가능*/}
    </Box>
  </Box> 
  );
}

function SoonHistoryCard({historyid, sjid, swid , kind, progress}: any) {
  const classes = soonHeaderStyles();
  const navigate = useNavigate();
  return (
  <Card className={classes.root} onClick={() => navigate(`/historycontents?historyid=${historyid}`)}>
    <CardContent>
      <Typography variant="h5">{sjid} | {swid} | {kind}{progress}</Typography>
    </CardContent>
  </Card>
  );
}

function SoonHistorySW({swid}: any) {
  const {isLoading, isError, data, error} = getSoonHistorySWListQuery(swid)
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  //TODO: id => nickname
  const soonHistorySW = data?.map(({historyid, sjid, swid , kind, progress}: any) => (
    <SoonHistoryCard key={historyid} sjid={sjid} swid={swid} kind={kind} progress={progress} />
  ));

  return(
    <Box>{soonHistorySW}</Box>
  );
}

function SoonHistorySJ({sjid}: any) {
  const {isLoading, isError, data, error} = getSoonHistorySJListQuery(sjid)
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  //TODO: id => nickname
  const soonHistorySJ = data?.map(({sjid, swid , kind, progress}: any) => (
    <SoonHistoryCard key={sjid} sjid={sjid} swid={swid} kind={kind} progress={progress} />
  ));

  return(
    <Box>{soonHistorySJ}</Box>
  );
}

