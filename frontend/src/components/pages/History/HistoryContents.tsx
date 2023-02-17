import {useParams} from "react-router-dom";
import {Box} from "@mui/material";
import {getSoonHistoryQuery} from "@recoils/soon/query";
import Error from "components/Error/Error";
import Loading from "components/Loading/Loading";

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
  return <Box>HistoryContents</Box>;
}
