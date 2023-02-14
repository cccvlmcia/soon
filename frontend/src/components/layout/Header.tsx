import {Box, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Button, Menu, MenuItem} from "@material-ui/core";
import {MyName} from "./Profile";
import {color, Container} from "@mui/system";

export default function Header() {
  const navigate = useNavigate();
  return (
    <Box sx={{background: "black", height: "50px"}}>
      <Stack color="white" direction={"row"} justifyContent="space-between" sx={{height: 50}}>
        <Stack direction={"row"} spacing={2} sx={{div: {padding: "17px 0"}}}>
          <Box onClick={() => navigate("/")}>Logo</Box>
          <Box onClick={() => navigate("/")}>홈</Box>
          <Box onClick={() => navigate("/campus")}>캠퍼스지체들</Box>
          <Box onClick={() => navigate("/admin")}>관리자</Box>
        </Stack>
        {/* {MyDropdownMenu()} */}
        <MyDropdownMenu />
      </Stack>
    </Box>
  );
}

function MyDropdownMenu() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Box>
      <Box>
        {MyName(11) ? (
          <Box color="white" onClick={handleClick} aria-controls="dropdown-menu" aria-haspopup="true">
            {MyName(11)}
          </Box>
        ) : (
          <Box sx={{color: "white", padding: "17px 10px", cursor: "pointer"}} onClick={handleLogin}>
            로그인
          </Box>
        )}
      </Box>
      <Menu id="dropdown-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => navigate("/soon/list")}>내 순원</MenuItem>
        <MenuItem onClick={() => navigate("/withdrawal")}>회원탈퇴</MenuItem>
      </Menu>
    </Box>
  );
}
