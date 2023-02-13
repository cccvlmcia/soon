import { Box } from "@mui/system";
import { Outlet } from "react-router-dom";
import Header from "./Header";
export default function Layout() {
  return (
    <Box>
      <Header />
      <Outlet />
    </Box>
  );
}
