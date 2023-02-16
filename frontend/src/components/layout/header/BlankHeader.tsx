import {Toolbar, Typography} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import {useLocation} from "react-router-dom";
import {getTitle, titles} from "./HeaderConstants";
export default function BlankHeader() {
  const {pathname} = useLocation();
  return (
    <>
      <AppBar sx={{position: "relative", backgroundColor: "#000000!important", color: "white!important"}}>
        <Toolbar>
          <Typography sx={{flex: 1}} variant="h6" component="div">
            {getTitle(pathname)}
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}
