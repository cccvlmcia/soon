import {Box, Button} from "@mui/material";
import {useGoogleLogin} from "@react-oauth/google";
import {getGoogleInfoAxios} from "@recoils/Login/axios";
import {userGoogleAuthState} from "@recoils/Login/state";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";

const Login = () => {
  const [googleAuth, setGoogleAuth] = useRecoilState(userGoogleAuthState);
  const navigate = useNavigate();
  const handleLoginSuccess = async (code: string) => {
    const result = getGoogleInfoAxios(code);
    const data = (await result)?.data || "GoogleInfo is missing";
    const status = data?.status;
    setGoogleAuth(data?.auth);
    console.log("set Google Auth : ",googleAuth);
    if (status == "REGISTER") {
      //TODO: 회원 가입 폼 이동
      console.log("회원 가입하시죠");
      // navigate("/register");
    } else {
      console.log("로그인 process 진행하시죠");
      const {ssoid, userid} = data?.auth;
      const result = await axios.post("http://localhost:4000/auth/token", {
        userid: userid,
        ssoid: ssoid,
      });
      console.log("result : ", result);
      // navigate("/");
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
