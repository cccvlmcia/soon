import {Box, IconButton, Toolbar, Typography} from "@mui/material";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import AppBar from "@mui/material/AppBar";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {getTitle} from "./HeaderConstants";
export default function PrevHeader() {
  const params = useParams();
  const location = useLocation();
  const {pathname} = useLocation();

  const navigate = useNavigate();
  const handlePrev = () => {
    navigate(-1);
  };
  return (
    <>
      <AppBar sx={{position: "relative", backgroundColor: "#000000!important", color: "white!important"}}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handlePrev} aria-label="close">
            <ArrowBackIosNewIcon color="secondary" />
          </IconButton>
          <Typography sx={{flex: 1}} variant="h6" component="div">
            {getTitle(pathname)}
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}
