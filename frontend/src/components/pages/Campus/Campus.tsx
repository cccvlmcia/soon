import {useEffect, useState} from "react";
import {Box, Stack} from "@mui/material";

import Error from "components/Error/Error";
import Loading from "react-loading";
import {UserCard} from "@layout/Card";
import {useRecoilState, useRecoilValue} from "recoil";
import {userState} from "@recoils/user/state";
import {selectedCampusState} from "@recoils/campus/state";
import {authState} from "@recoils/auth/state";
import {getCampusUserQuery} from "@recoils/campus/query";
import NoData from "components/common/NoData";
import {Button} from "@material-ui/core";
import CampusDialog from "@pages/MyProfile/modal/CampusDialog";
export default function Campus() {
  const loginUser: any = useRecoilValue(userState);
  const [campusList, setCampusList] = useState([]);
  const [campus, setCampus]: any = useRecoilState(selectedCampusState);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const list = loginUser?.campus?.map(({campus}: any) => campus);
    setCampusList(list);
    if (campus == null && list?.length > 0) {
      setCampus(list[0]);
    }
  }, [loginUser, campus, setCampus]);

  const handleCampus = (campus: any) => {
    setCampus(campus);
  };
  return (
    <>
      <Box sx={{textAlign: "center"}}>
        <Button fullWidth variant="outlined" onClick={() => setOpen(true)}>
          {campus?.name}
        </Button>
      </Box>
      <CampusDialog open={open} setOpen={setOpen} items={campusList} campusSelected={campus} handleCampus={handleCampus} />
      <CampusUserList campus={campus} />
    </>
  );
}

function CampusUserList({campus}: any) {
  const loginUser: any = useRecoilValue(userState);
  const campusid = loginUser?.campus[0]?.campus?.campusid;
  const {isLoading, isError, data, error, refetch} = getCampusUserQuery(campus?.campusid || campusid);
  const authes = useRecoilValue(authState);
  const auth = loginUser?.auth;
  const isAdmin = auth?.filter(({authid}: {authid: string}) => authes?.filter(({id}) => id == authid)?.length > 0)?.length > 0;

  console.log("data >", data);
  useEffect(() => {
    refetch();
  }, [campus]);

  const userList = data?.map(({userid, user, campus, major, sid}: any) => (
    <UserCard
      key={userid}
      userid={userid}
      nickname={user?.nickname}
      campus={campus?.name}
      major={major}
      sid={sid}
      isAdmin={isAdmin}
      authList={user?.auth}
    />
  ));

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    if (loginUser?.campus?.length == 0) {
      return <NoData />;
    } else {
      return <Error error={error} />;
    }
  }

  return (
    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <Box component={"h1"}>{campus?.name}</Box>
      <Box sx={{display: "flex", gap: 1, flexFlow: "row wrap", justifyContent: "center"}}>{userList}</Box>
    </Box>
  );
}
