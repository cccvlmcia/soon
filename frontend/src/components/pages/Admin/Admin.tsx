import {Box, Button, List, ListItem, ListItemText} from "@mui/material";
import CampusDialog from "@pages/MyProfile/modal/CampusDialog";

import {userState} from "@recoils/user/state";
import Error from "components/Error/Error";
import Loading from "components/Loading/Loading";
import {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import UserDialog from "./modal/UserDialog";
import {ListItemButton, Divider} from "@mui/material";
import {getCampusUserQuery} from "@recoils/campus/query";
import {selectedCampusState} from "@recoils/campus/state";

export default function Admin() {
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
  }, [loginUser]);
  const handleCampus = (campus: any) => {
    setCampus(campus);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        ".row": {
          display: "flex",
          alignItems: "center",
          padding: "5px",
        },
        ".header": {
          width: "100px",
        },
        ".body": {
          width: "calc(100% - 100px - 20px)",
          padding: "0 5px",
        },
      }}>
      <Box sx={{textAlign: "center"}}>
        <Button fullWidth variant="outlined" onClick={() => setOpen(true)}>
          {campus?.name}
        </Button>
      </Box>

      {campus && <SoonSetting campus={campus} />}
      <CampusDialog open={open} setOpen={setOpen} items={campusList} campusSelected={campus} handleCampus={handleCampus} />
    </Box>
  );
}

function SoonSetting({campus}: any) {
  const {isLoading, isError, data, error, refetch} = getCampusUserQuery(campus?.campusid);
  const [sjopen, setSjOpen] = useState(false);
  const [campusUserList, setCampusUserList] = useState([]);
  const [sjList, setSJList] = useState([]);
  //캠퍼스 바뀔 때 마다 refetch해서 다시 가져옴
  useEffect(() => {
    refetch();
  }, [campus]);
  //데이터 가져오면 list 변경
  useEffect(() => {
    setCampusUserList(data);
    const list = data?.filter((item: any) => item?.user?.soon?.length > 0);
    setSJList(list);
  }, [data]);
  const onChangeSoonjang = () => {
    setSjOpen(true);
  };
  const handleSoonjang = (list: []) => {
    setSJList(list);
    //사용자들 순장 으로 추가 하는데,.... 순원이 있어야 되네?????????
  };

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    console.log("error >", error);
    return <Error error={error} />;
  }

  const itemList = campusUserList?.map((item: any) => (
    <Box key={item?.userid}>
      <ListItemButton>
        <ListItemText primary={item?.user?.nickname} secondary={item?.user?.sj?.map(({soonwon}: any) => soonwon?.nickname)} />
      </ListItemButton>
      <Divider />
    </Box>
  ));

  return (
    <>
      <Box className="row">
        <Button variant="outlined" onClick={onChangeSoonjang}>
          순 매칭
        </Button>
      </Box>
      <List>{itemList}</List>
      <UserDialog
        open={sjopen}
        setOpen={setSjOpen}
        items={campusUserList}
        selected={sjList}
        campus={campus}
        handleOK={handleSoonjang}
        refetch={refetch}
      />
    </>
  );
}
