import {styles} from "@layout/styles";
import {useParams} from "react-router-dom";
import {Box} from "@mui/material";
import {getSoonHistoryQuery} from "@recoils/soon/query";
import {Prayer} from "@recoils/types";
import {userState} from "@recoils/user/state";
import Error from "components/Error/Error";
import Loading from "components/Loading/Loading";
import {useRecoilValue} from "recoil";

export default function HistoryContents() {
  const {historyid} = useParams();
  const {isLoading, isError, data, error} = getSoonHistoryQuery(Number(historyid));
  const loginUser: any = useRecoilValue(userState);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  const isSoonjang = loginUser?.config?.userid === data.sjid;
  const isSoonwon = loginUser?.config?.userid === data.swid;
  const hasPrayAuth = isSoonjang || isSoonwon;

  //  const  config  =loginUser?.config?.userid === data.swid || loginUser?.config?.userid === data.sjid)
  let prays: Prayer[] = data?.prays;
  if (!hasPrayAuth) {
    prays = prays.filter((pray: any) => pray.publicyn == "N");
  }
  console.log(prays);
  const prayView = prays.map(({pray, publicyn}: any, index: number) => (
    <Box>
      <Box key={index}>
        {index + 1} : {pray}
      </Box>
    </Box>
  ));
  //FIXME: 캠퍼스 추가하고 싶으면 엔티티에 순원 캠퍼스 넣어서 가져오도록 하셈
  return (
    <Box
      sx={[
        historyid ? styles.mobile.container : styles.web.container,
        styles.web.writeform,
        {
          marginTop: "40px",
          ".row": {display: "flex", alignItems: "center", marginTop: "5px"},
          ".header": {width: "70px", textAlign: "left", padding: "0 10px 0 40px", fontSize: "16px"},
        },
      ]}>
      <Box className="row">
        <Box className="header">순장</Box>
        <Box sx={{width: "200px"}}>{data?.soonjang?.nickname}</Box>
      </Box>
      <Box className="row">
        <Box className="header">분류</Box>
        <Box>{data?.kind}</Box>
      </Box>
      <Box className="row">
        <Box className="header">진도</Box>
        <Box>{data?.progress}</Box>
      </Box>
      <Box className="row">
        <Box className="header">순원</Box>
        <Box>{data?.soonwon?.nickname}</Box>
      </Box>
      <Box className="row">
        <Box className="header">날짜</Box>
        <Box>{data?.historydate}</Box>
      </Box>
      <Box className="row">
        <Box className="header">내용</Box>
        <Box>{data?.contents}</Box>
      </Box>
      <Box className="row">
        <Box className="header">기도제목</Box>
        <Box>{prayView}</Box>
      </Box>
    </Box>
  );
}
