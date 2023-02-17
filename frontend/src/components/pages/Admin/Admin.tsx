import {useEffect, useState} from "react";
import {Box, Button, List, ListItemText, ListItemButton, Divider} from "@mui/material";
import {userState} from "@recoils/user/state";
import CampusDialog from "@pages/MyProfile/modal/CampusDialog";
import Error from "components/Error/Error";
import Loading from "components/Loading/Loading";
import {useRecoilState, useRecoilValue} from "recoil";
import UserDialog from "./modal/UserDialog";
import {getCampusUserQuery} from "@recoils/campus/query";
import {selectedCampusState} from "@recoils/campus/state";
import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {getTitle} from "@layout/header/HeaderConstants";
import {useLocation} from "react-router-dom";
import DrawerMenu from "@layout/header/drawer/DrawerMenu";
import AddIcon from "@mui/icons-material/Add";
export default function Admin() {
  const loginUser: any = useRecoilValue(userState);
  const [campusList, setCampusList] = useState([]);
  const [campus, setCampus]: any = useRecoilState(selectedCampusState);
  const [open, setOpen] = useState(false);
  const [sjopen, setSjOpen] = useState(false);

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

  const onChangeSoonjang = () => {
    setSjOpen(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
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
      <MyHeader onChangeSoonjang={onChangeSoonjang} />
      <Box sx={{textAlign: "center"}}>
        <Button fullWidth variant="outlined" onClick={() => setOpen(true)}>
          {campus?.name}
        </Button>
      </Box>
      {campus && <SoonSetting campus={campus} sjopen={sjopen} setSjOpen={setSjOpen} />}
      <CampusDialog open={open} setOpen={setOpen} items={campusList} campusSelected={campus} handleCampus={handleCampus} />
    </Box>
  );
}

function SoonSetting({campus, sjopen, setSjOpen}: any) {
  const {isLoading, isError, data, error, refetch} = getCampusUserQuery(campus?.campusid);
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
  const handleSoonjang = (list: []) => {
    setSJList(list);
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
function MyHeader({onChangeSoonjang}: any) {
  const [loginUser, setLoginUser] = useRecoilState(userState);
  const {pathname} = useLocation();
  const [open, setOpen] = useState(false);

  const handleMenuOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <AppBar sx={{position: "relative", backgroundColor: "#000000!important", color: "white!important"}}>
        <Toolbar>
          <IconButton edge="start" onClick={handleMenuOpen} aria-label="close">
            <MenuIcon color="secondary" />
          </IconButton>
          <Box>
            <Typography variant="h6" component="div">
              {getTitle(pathname)}
            </Typography>
          </Box>
          <Box sx={{marginLeft: "auto"}}>
            <IconButton edge="end" onClick={onChangeSoonjang} aria-label="close">
              <AddIcon color="secondary" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <DrawerMenu data={loginUser} open={open} handleMenuOpen={handleMenuOpen} setLoginUser={setLoginUser} />
    </>
  );
}
