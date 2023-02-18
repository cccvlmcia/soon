import {useState} from "react";
import {useRecoilState} from "recoil";

import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {useLocation} from "react-router-dom";
import {userState} from "@recoils/user/state";
import {getTitle} from "./HeaderConstants";
import DrawerMenu from "./drawer/DrawerMenu";

export default function MenuHeader() {
  const [open, setOpen] = useState(false);
  const [loginUser, setLoginUser] = useRecoilState(userState);
  const {pathname} = useLocation();
  const handleMenuOpen = () => {
    setOpen(!open);
  };
  return (
    <>
      <AppBar sx={{position: "relative", backgroundColor: "#292929 !important", color: "white!important"}}>
        <Toolbar>
          <IconButton edge="start" onClick={handleMenuOpen} aria-label="close">
            <MenuIcon color="secondary" />
          </IconButton>
          <Box sx={{ml: 2}}>
            <Typography variant="h6" component="div">
              {getTitle(pathname)}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <DrawerMenu data={loginUser} open={open} handleMenuOpen={handleMenuOpen} loginUser={loginUser} setLoginUser={setLoginUser} />
    </>
  );
}
