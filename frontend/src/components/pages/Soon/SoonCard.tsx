import {Box} from "@mui/material";
import {SoonCardHeader} from "@layout/Card";
import {getUserInfoQuery} from "@recoils/api/User";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";
import {useParams} from "react-router-dom";

export default function SoonCard() {
  const params = useParams();
  const userid = Number(params?.userid) || 0;
  const {isLoading, isError, data, error} = getUserInfoQuery(userid);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  console.log("data >>", data);

  return (
    <Box>
      <SoonCardHeader nickname={data.nickname} area={"a"} campus={"c"} />
    </Box>
  );

  //순모임 히스토리
  //순원정보
  /**{
   * 이름:
   * 지구:
   * 캠퍼스:
   * 해준 순모임
   * 받은 순모임
   * } */
}
