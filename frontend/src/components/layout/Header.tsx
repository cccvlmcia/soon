import {Box, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Button, Menu, MenuItem} from "@material-ui/core";
import {getUserInfoQuery} from "@recoils/api/User";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";

export default function Header() {
  const navigate = useNavigate();
  const userid = 1 //TODO: user#
  const {isLoading, isError, data, error} = getUserInfoQuery(userid);
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
      <Box>
        {data.nickname ? (
          <Box color="white" onClick={handleClick} aria-controls="dropdown-menu" aria-haspopup="true">
            {data.nickname}
          </Box>
        ) : (
          <Box sx={{color: "white", padding: "17px 10px", cursor: "pointer"}} onClick={handleLogin}>
            로그인
          </Box>
        )}
      </Box>
      <Menu id="dropdown-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => navigate("/soon/list")}>내 순원</MenuItem>
        <MenuItem onClick={() => navigate(`/withdrawal/${data.userid}`)}>회원탈퇴</MenuItem>
      </Menu>
    </Box>
  );
}
