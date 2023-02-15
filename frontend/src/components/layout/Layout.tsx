import {Box} from "@mui/system";
import {Outlet} from "react-router-dom";
import Header from "./Header";
import {useMediaQuery} from "@mui/material";

export default function Layout() {
  const isMobile = useMediaQuery("(max-width:600px");
  return (
    <Box>
      <Header />
      <Outlet />
    </Box>
  );
}
