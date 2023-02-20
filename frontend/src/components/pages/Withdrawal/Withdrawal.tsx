import {useState} from "react";
import {Box} from "@mui/material";
import {useGoogleLogin} from "@react-oauth/google";
import {getGoogleInfoAxios} from "@recoils/login/axios";
import {userState} from "@recoils/user/state";
import {useRecoilState, useSetRecoilState} from "recoil";
import ModalDialog from "./modal/ModalDialog";
import {postLogout, removeUser} from "@recoils/user/axios";
import {useNavigate} from "react-router-dom";
import GoogleButton from "react-google-button";
import {selectedCampusState} from "@recoils/campus/state";

export default function Withdrawal() {
  const [open, setOpen] = useState(false);
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const navigate = useNavigate();
  const setSelectedCampus = useSetRecoilState(selectedCampusState);

  console.log("loginUser >", loginUser);

  const googleSocialLogin = useGoogleLogin({
    scope: "email profile",
    onSuccess: async ({code}) => {
      const {
        data,
        data: {status, auth, user},
      } = await getGoogleInfoAxios(code);
      if (status == "LOGIN") {
        const {ssoid} = auth;
        const {userid} = user;
        if (loginUser?.userid == userid) {
          setOpen(true);
        } else {
          alert("인증에 실패했습니다. 로그인한 사용자로 인증하세요.");
        }
      } else {
        alert("인증에 실패했습니다. 로그인한 사용자로 인증하세요.");
      }
    },
    flow: "auth-code",
  });
  /*
    setSelectedCampus(null);
    handleMenuOpen();
    navigate("/login");

  */
  const handleOK = async () => {
    console.log("handleOK");
    //사용자 삭제, 로그아웃 처리
    await removeUser(loginUser?.userid);
    await postLogout();
    setLoginUser(null);
    setSelectedCampus(null);

    alert("탈퇴 되었습니다.");
    navigate("/login");
  };

  return (
    <Box>
      <Box sx={{display: "flex", alignItems: "center", gap: "30px", width: "100%", height: "300px", justifyContent: "center", flexDirection: "column"}}>
      <Box component="img" src="/public/images/goodbye.jpg" sx={{maxWidth: "100%", maxHeight: "100%"}}></Box>
        <GoogleButton onClick={googleSocialLogin} />
      </Box>
      <ModalDialog open={open} setOpen={setOpen} handleOK={handleOK} />
    </Box>
  );
};

