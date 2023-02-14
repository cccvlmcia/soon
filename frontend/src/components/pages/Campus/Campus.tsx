import {Box, Stack} from "@mui/material";
import {getCampusUserQuery, getUserInfoQuery} from "@recoils/api/User";
import Error from "components/Error/Error";
import Loading from "react-loading";
import UserCard from "@layout/Card";

function campusData(campusid: string) {
  const {isLoading, isError, data, error} = getCampusUserQuery(campusid);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  return data;
}

function MyCampusId(userid: number) {
  const {isLoading, isError, data, error} = getUserInfoQuery(userid);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  return data.campus && data.campus[0].campusid;
}

export default function Campus() {
  return (
    <Box>
      <Stack direction={"row"}>
        <Box></Box>
      </Stack>
    </Box>
  );
}
