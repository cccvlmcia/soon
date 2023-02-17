import {Box} from "@mui/system";
import {Outlet} from "react-router-dom";
import MenuHeader from "./header/MenuHeader";

export default function Layout({children}: any) {
  return (
    <Box>
      {children}
      <Outlet />
    </Box>
  );
}
