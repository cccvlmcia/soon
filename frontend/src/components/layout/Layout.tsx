import {Box} from "@mui/system";
import {Outlet} from "react-router-dom";
import MenuHeader from "./header/MenuHeader";
// import {useMediaQuery} from "@mui/material";

export default function Layout({children}: any) {
  // const isMobile = useMediaQuery("(max-width:600px");
  return (
    <Box>
      {children}
      <Outlet />
    </Box>
  );
}
