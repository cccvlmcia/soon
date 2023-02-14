import {Box, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Button, Menu, MenuItem} from "@material-ui/core";
import {getUserInfoQuery} from "@recoils/api/User";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";

export default function Header() {
  const navigate = useNavigate();
  const {isLoading, isError, data, error} = getUserInfoQuery(1);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  return (
    <Box sx={{background: "black", height: "50px"}}>
      <Stack color="white" direction={"row"} justifyContent="space-between" sx={{height: 50}}>
        <Stack direction={"row"} spacing={2} sx={{div: {padding: "17px 0"}}}>
          <Box onClick={() => navigate("/")}>Logo</Box>
          <Box onClick={() => navigate("/")}>홈</Box>
          <Box onClick={() => navigate("/campus")}>캠퍼스지체들</Box>
          <Box onClick={() => navigate("/admin")}>관리자</Box>
        </Stack>
        <Box>
          <MyDropdownMenu data={data} />
        </Box>
      </Stack>
    </Box>
  );
}

function MyDropdownMenu({data}: any) {
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
      <Button aria-controls="dropdown-menu" aria-haspopup="true" onClick={handleClick}>
        <Box color="white">{data.nickname}</Box>
      </Button>
      <Menu id="dropdown-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => navigate("/soon/list")}>내 순원</MenuItem>
        <MenuItem onClick={() => navigate("/withdrawal")}>회원탈퇴</MenuItem>
      </Menu>
    </Box>
  );
}
