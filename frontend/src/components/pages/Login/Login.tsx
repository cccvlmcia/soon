import {Box} from "@mui/material";
import {useGoogleLogin} from "@react-oauth/google";
import {getGoogleInfoAxios, getToken} from "@recoils/Login/axios";
import {userGoogleAuthState} from "@recoils/Login/state";
import {userState} from "@recoils/user/state";
import {useNavigate} from "react-router-dom";
import {useRecoilState, useSetRecoilState} from "recoil";
import GoogleButton from "react-google-button";

const Login = () => {
  const [googleAuth, setGoogleAuth] = useRecoilState(userGoogleAuthState);
  const setUser = useSetRecoilState(userState);

  const navigate = useNavigate();
  const handleLoginSuccess = async (code: string) => {
    const {
      data,
      data: {status, auth, user},
    } = await getGoogleInfoAxios(code);

    if (status == "REGISTER") {
      setGoogleAuth(data);//구글 sso 로그인 등록을 하기 위한, 정보를 state에 저장함

      //TODO: 회원 가입 폼 이동
      // console.log("회원 가입하시죠");
      navigate("/register");
    } else {
      // console.log("로그인 process 진행하시죠", auth);
      const {ssoid} = auth;
      const {userid} = user;
      const result = await getToken({userid, ssoid}); //로그인 하고, 토큰을 가져온다
      // console.log("result : ", result?.data);
      setUser(user); // loginUser, #user 통채로 저장하지 않고, access_token으로 가져오도록 수정
      setGoogleAuth(null); //혹시나 유저 정보가 들어있을지 모르니까 비운다
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
    <Box sx={{display: "flex", alignItems: "center", width: "100%", height: "300px", justifyContent: "center", flexDirection: "column"}}>
      <Box component="img" src="/public/images/logo.jpg" sx={{maxWidth: "100%", maxHeight: "100%"}}></Box>

      <Box>
        <GoogleButton onClick={googleSocialLogin} />
      </Box>
    </Box>
  );
};

export default Login;
