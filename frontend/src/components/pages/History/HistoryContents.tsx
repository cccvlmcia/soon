import {Box} from "@mui/material";
import {getSoonHistoryQuery} from "@recoils/soon/query";
import Error from "components/Error/Error";
import Loading from "components/Loading/Loading";
import {useParams} from "react-router-dom";

export default function HistoryContents() {
  const {historyid} = useParams();
  const {isLoading, isError, data, error} = getSoonHistoryQuery(Number(historyid));
  console.log("history Contents", historyid, data);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  } 

  const prays = data?.prays?.map(({prayid,pray, publicyn}: any) => (
    <Box key={prayid}>
      <Box>{pray}</Box>
      <Box>{publicyn}</Box>
    </Box>
  ));
  console.log("prays >>", prays);

  return (
  <Box>
    <Box>
      <Box>순장</Box>
      <Box>{data?.soonjang?.nickname}</Box>
    </Box>
    <Box>
      <Box>분류</Box>
      <Box>{data?.kind}</Box>
    </Box>
    <Box>
      <Box>진도</Box>
      <Box>{data?.progress}</Box>
    </Box>
    <Box>
      <Box>순원</Box>
      <Box>{data?.soonwon?.nickname}</Box>
    </Box>
    <Box>
      <Box>날짜</Box>
      <Box>{data?.historydate}</Box>
    </Box>
    <Box>
      <Box>내용</Box>
      <Box>{data?.contents}</Box>
    </Box>
    <Box>
      <Box>기도제목</Box>
      <Box>{prays}</Box>
    </Box>
  </Box>);
}
