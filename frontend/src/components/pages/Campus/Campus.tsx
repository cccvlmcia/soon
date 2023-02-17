import {useEffect, useState} from "react";
import {Box} from "@mui/material";

import Error from "components/Error/Error";
import Loading from "react-loading";
import {UserCard} from "@layout/Card";
import {useRecoilState, useRecoilValue} from "recoil";
import {userState} from "@recoils/user/state";
import {selectedCampusState} from "@recoils/campus/state";
import {authState} from "@recoils/auth/state";
import {getCampusUserQuery} from "@recoils/campus/query";
import NoData from "components/common/NoData";
import CampusDialog from "@pages/MyProfile/modal/CampusDialog";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
      <Box sx={{textAlign: "center", fontSize: "20px", margin: "20px 0"}}>
        <Box onClick={() => setOpen(true)} sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
          <Box>{campus?.name}</Box>
          <KeyboardArrowDownIcon sx={{width: 20, height: 20}} />
        </Box>
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

  useEffect(() => {
    refetch();
  }, [campus]);

  const newData =
    data &&
    data.sort((prev: any, next: any) => {
      if (prev["sid"] > next["sid"]) return -1;
      if (prev["sid"] < next["sid"]) return 1;
    });
  const userList = newData?.map(({userid, user, campus, major, sid}: any) => {
    return (
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
    );
  });

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
      <Box sx={{display: "flex", gap: 1, flexFlow: "row wrap", justifyContent: "center"}}>{userList}</Box>
    </Box>
  );
}
