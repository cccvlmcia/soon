import {Token} from "@mui/icons-material";
import {Box, Button} from "@mui/material";
import {useGoogleLogin} from "@react-oauth/google";
import {api} from "@recoils/consonants";
import {userState} from "@recoils/user/state";
import axios from "axios";
import {stat} from "fs";
import {useEffect} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import {getStorage, setStorage} from "utils/SecureStorage";

const Login = () => {
  const [storedUser, setStoredUser] = useRecoilState(userState);
  const navigate = useNavigate();
  const handleLoginSuccess = async (code: string) => {
    const {data} = await axios.post("http://localhost:4000/auth/google/callback", {code});
    //FIXME: 유저가 등록되어 있지 않은 경우 미리 데이터 저장하면, user id가 누락 됨
    setStoredUser(data);
    const {status} = data;
    const {ssoid, userid} = data;
    console.log("local storage stored data : ", userid);
    if (status == "REGISTER") {
      //TODO: 회원 가입 폼 이동
      console.log("회원 가입하시죠");
      navigate("/register");
    } else {
      //TODO: 바로 로그인
      console.log("로그인 process 진행하시죠");
      const result = await axios.post(
        "http://localhost:4000/auth/token",
        {
          userid: userid,
          ssoid: ssoid,
        },
        {withCredentials: true},
      );
      console.log("result : ", result);
      navigate("/");
    }
  };

  const handleLoginError = (errorResponse: any) => {
    console.error(errorResponse);
  };
  const googleSocialLogin = useGoogleLogin({
    scope: "email profile",
    onSuccess: async ({code}) => {
      handleLoginSuccess(code);
    },
    onError: errorResponse => {
      handleLoginError(errorResponse);
    },
    flow: "auth-code",
  });

  return (
    <Box>
      <Box>
        <Button onClick={googleSocialLogin}>Google Button</Button>
      </Box>
    </Box>
  );
};

export default Login;
