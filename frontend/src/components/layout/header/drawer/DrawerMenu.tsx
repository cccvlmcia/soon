import {useNavigate} from "react-router-dom";

import {Box} from "@mui/material";
import {Drawer} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import {postLogout} from "@recoils/user/axios";

export default function DrawerMenu({data, open, handleMenuOpen, setLoginUser}: {data: any; open: any; handleMenuOpen: any; setLoginUser: any}) {
  const navigate = useNavigate();
  const move = (route: string) => {
    handleMenuOpen();
    navigate(route);
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const handleLogout = async () => {
    await postLogout();
    alert("로그아웃 되었습니다.");
    setLoginUser(null);
    handleMenuOpen();
    navigate("/login");
  };
  const handleUser = () => {
    handleMenuOpen();
    navigate(`/myprofile`);
  };
  return (
    <Drawer open={open} onClose={handleMenuOpen}>
      <Box>
        <CloseIcon color="primary" sx={{margin: "13px", cursor: "pointer"}} onClick={handleMenuOpen} />
      </Box>
      <Box
        sx={{
          width: "250px",
          display: "flex",
          flexDirection: "column",
          borderTop: "1px solid #EFEFEF",
          "> div": {padding: "20px", cursor: "pointer", borderBottom: "1px solid #EFEFEF"},
        }}>
        <Box onClick={() => move("/")}>홈</Box>
        {data?.nickname && (
          <Box sx={{padding: "16px 12px", cursor: "pointer"}}>
            <Box sx={{display: "flex"}} onClick={handleUser}>
              <AccountCircleIcon />
              {data?.nickname}
            </Box>
          </Box>
        )}
        <Box onClick={() => move("/campus")}>내 캠퍼스</Box>
        <Box onClick={() => move("/myprofile/add")}>캠퍼스 추가</Box>
        <Box onClick={() => move("/soon/list")}>내 순원</Box>
        <Box onClick={() => move("/admin")}>관리자</Box>
        <Box onClick={() => handleLogout()}>로그아웃</Box>
        <Box onClick={() => move("/withdrawal")}>회원탈퇴</Box>
      </Box>
    </Drawer>
  );
}
