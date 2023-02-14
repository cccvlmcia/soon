import {Box} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

import {Drawer} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import {getUserInfoQuery} from "@recoils/api/User";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";
import {userState} from "@recoils/user/state";
import {useRecoilValue} from "recoil";

export default function Header() {
  const [open, setOpen] = useState(false);
  //FIXME: loginUser로 변경
  const loginUser = useRecoilValue(userState);
  const {isLoading, isError, data, error} = getUserInfoQuery(1);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  const handleMenuOpen = () => {
    setOpen(!open);
  };
  return (
    <Box sx={{background: "black", height: "50px"}}>
      <MenuIcon onClick={handleMenuOpen} color="secondary" sx={{margin: "13px"}} />
      <DrawerMenu data={data} open={open} handleMenuOpen={handleMenuOpen} />
    </Box>
  );
}

function DrawerMenu({data, open, handleMenuOpen}: {data: any; open: any; handleMenuOpen: any}) {
  const navigate = useNavigate();
  const move = (route: string) => {
    handleMenuOpen();
    navigate(route);
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const handleLogout = () => {};
  return (
    <Drawer open={open} onClose={handleMenuOpen}>
      <Box>
        <CloseIcon color="primary" sx={{margin: "13px", cursor: "pointer"}} onClick={handleMenuOpen} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          borderTop: "1px solid #EFEFEF",
          "> div": {padding: "20px", cursor: "pointer", borderBottom: "1px solid #EFEFEF"},
        }}>
        <Box sx={{padding: "16px 12px", cursor: "pointer"}}>
          {data?.nickname ? (
            <Box sx={{display: "flex"}}>
              <AccountCircleIcon />
              {data.nickname}
            </Box>
          ) : (
            <Box sx={{color: "white", padding: "16px 10px", cursor: "pointer"}} onClick={handleLogin}>
              로그인
            </Box>
          )}
        </Box>
        <Box onClick={() => move("/")}>홈</Box>
        <Box onClick={() => move("/campus")}>캠퍼스지체들</Box>
        <Box onClick={() => move("/admin")}>관리자</Box>
        {data && (
          <Box sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
            <Box onClick={() => handleLogout()}>로그아웃</Box>
            <Box onClick={() => move("/soon/list")}>내 순원</Box>
            <Box onClick={() => move("/withdrawal")}>회원탈퇴</Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
