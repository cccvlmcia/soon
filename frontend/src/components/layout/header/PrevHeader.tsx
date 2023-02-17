import {useLocation, useNavigate} from "react-router-dom";
import {Box, IconButton, Toolbar, Typography} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {getTitle} from "./HeaderConstants";
export default function PrevHeader() {
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
          <Box sx={{ml: 2}}>
            <Typography variant="h6" component="div">
              {getTitle(pathname)}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
