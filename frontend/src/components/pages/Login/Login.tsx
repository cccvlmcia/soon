import {Box, Button} from "@mui/material";
import {useGoogleLogin} from "@react-oauth/google";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {setStorage} from "utils/SecureStorage";

const Login = () => {
  const navigate = useNavigate();
  const handleLoginSuccess = async (code: string) => {
    const {data} = await axios.post("http://localhost:4000/auth/google/callback", {code});
    console.log("data >> ", data);

    const {status} = data;
    const {ssoid, userid} = data;
    console.log("auth : ", ssoid, userid);
    setStorage("#user", JSON.stringify(data));
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
