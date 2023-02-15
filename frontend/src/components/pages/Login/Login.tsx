import {Box, Button} from "@mui/material";
import {useGoogleLogin} from "@react-oauth/google";
import {getGoogleInfoAxios} from "@recoils/Login/axios";
import {userGoogleAuthState} from "@recoils/Login/state";
import {userState} from "@recoils/User/state";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useRecoilState, useSetRecoilState} from "recoil";

const Login = () => {
  const [googleAuth, setGoogleAuth] = useRecoilState(userGoogleAuthState);
  const setUser = useSetRecoilState(userState);

  const navigate = useNavigate();
  const handleLoginSuccess = async (code: string) => {

    const {
      data: {status, auth, user},
    } = await getGoogleInfoAxios(code);
    // const status = data?.status;

    if (status == "REGISTER") {
      setGoogleAuth(Object.assign(auth, status));

      //TODO: 회원 가입 폼 이동
      console.log("회원 가입하시죠");
      navigate("/register");
    } else {
      console.log("로그인 process 진행하시죠", auth);
      const {ssoid} = auth;
      const {userid} = user;
      const result = await axios.post("/auth/token", {userid, ssoid});
      // console.log("result : ", result?.data);
      setUser(user); // loginUser, #user 통채로 저장하지 않고, access_token으로 가져오도록 수정
      setGoogleAuth(null); //혹시 들어잇을지 모르니 지운다
      navigate("/");
    }
  };
  /*
    1. header - x_auth Bearer
    2. storage  access_token, refresh_token
    3. cookie access_token, refresh_token
  */

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
      <Button onClick={googleSocialLogin}>Google Button</Button>
    </Box>
  );
};

export default Login;
