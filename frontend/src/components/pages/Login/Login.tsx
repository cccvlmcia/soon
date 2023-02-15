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
  const setLoginUser = useSetRecoilState(userState);
  const navigate = useNavigate();
  const handleLoginSuccess = async (code: string) => {
    const {data} = await getGoogleInfoAxios(code);
    const status = data?.status;
    if (status == "REGISTER") {
      setGoogleAuth(data?.auth);
      //TODO: 회원 가입 폼 이동
      console.log("회원 가입하시죠");
      navigate("/register");
    } else {
      console.log("로그인 process 진행하시죠", data);
      const {ssoid} = data?.auth;
      const {userid} = data?.user;
      const user = data?.user;
      const result = await axios.post("http://localhost:4000/auth/token", {userid: userid, ssoid: ssoid});
      setLoginUser(user);
      setGoogleAuth(null);
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
      <Button onClick={googleSocialLogin}>Google Button</Button>
    </Box>
  );
};

export default Login;
