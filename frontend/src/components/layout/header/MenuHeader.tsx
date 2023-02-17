import {useState} from "react";
import {useRecoilState} from "recoil";

import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {useLocation} from "react-router-dom";
import {userState} from "@recoils/user/state";
import {getTitle} from "./HeaderConstants";
import DrawerMenu from "./drawer/DrawerMenu";

export default function MenuHeader() {
  const [open, setOpen] = useState(false);
  const [loginUser, setLoginUser] = useRecoilState(userState);
  const {pathname} = useLocation();
  const handleMenuOpen = () => {
    setOpen(!open);
  };
  return (
    <>
      <AppBar sx={{position: "relative", backgroundColor: "#000000!important", color: "white!important"}}>
        <Toolbar>
          <IconButton edge="start" onClick={handleMenuOpen} aria-label="close">
            <MenuIcon color="secondary" />
          </IconButton>
          <Box sx={{ml: 2}}>
            <Typography variant="h6" component="div">
              {getTitle(pathname)}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <DrawerMenu data={loginUser} open={open} handleMenuOpen={handleMenuOpen} setLoginUser={setLoginUser} />
    </>
  );
}

// function DrawerMenu({data, open, handleMenuOpen, setLoginUser}: {data: any; open: any; handleMenuOpen: any; setLoginUser: any}) {
//   const navigate = useNavigate();
//   const move = (route: string) => {
//     handleMenuOpen();
//     navigate(route);
//   };

//   const handleLogin = () => {
//     navigate("/login");
//   };
//   const handleLogout = async () => {
//     await postLogout();
//     alert("로그아웃 되었습니다.");
//     setLoginUser(null);
//     handleMenuOpen();
//     navigate("/login");
//   };
//   const handleUser = () => {
//     handleMenuOpen();
//     navigate(`/myprofile/${data?.userid}`);
//   };
//   return (
//     <Drawer open={open} onClose={handleMenuOpen}>
//       <Box>
//         <CloseIcon color="primary" sx={{margin: "13px", cursor: "pointer"}} onClick={handleMenuOpen} />
//       </Box>
//       <Box
//         sx={{
//           width: "250px",
//           display: "flex",
//           flexDirection: "column",
//           borderTop: "1px solid #EFEFEF",
//           "> div": {padding: "20px", cursor: "pointer", borderBottom: "1px solid #EFEFEF"},
//         }}>
//         <Box onClick={() => move("/")}>홈</Box>
//         {data?.nickname && (
//           <Box sx={{padding: "16px 12px", cursor: "pointer"}}>
//             <Box sx={{display: "flex"}} onClick={handleUser}>
//               <AccountCircleIcon />
//               {data?.nickname}
//             </Box>
//           </Box>
//         )}
//         <Box onClick={() => move("/campus")}>내 캠퍼스</Box>
//         <Box onClick={() => move("/soon/list")}>내 순원</Box>
//         <Box onClick={() => move("/admin")}>관리자</Box>
//         <Box onClick={() => handleLogout()}>로그아웃</Box>
//         <Box onClick={() => move("/withdrawal")}>회원탈퇴</Box>
//       </Box>
//     </Drawer>
//   );
// }
