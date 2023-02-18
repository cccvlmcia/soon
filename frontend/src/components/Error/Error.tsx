import {Box} from "@mui/material";
import {server} from "@recoils/constants";
import {userState} from "@recoils/user/state";
import Loading from "components/Loading/Loading";
import {useNavigate, useLocation} from "react-router-dom";
import {useRecoilValue} from "recoil";

export default function Error({error}: any) {
  const loginUser = useRecoilValue(userState);
  const location = useLocation();
  const navigate = useNavigate();
  if (Number(error?.response?.status) > 500) {
    // alert("로그인 페이지로 이동합니다.");
    if (loginUser) {
      server
        .post("/auth/refreshToken")
        .then(data => {
          const {pathname} = location;
          if (pathname) {
            navigate(0);
          }
        })
        .catch(err => {
          navigate("/login");
        });
      return <Loading />;
    } else {
      navigate("/login");
    }
  }
  return (
    <Box>
      {error && (
        <Box sx={{display: "flex", flexDirection: "column"}}>
          <Box component="span">Code : {error?.code}</Box>
          <Box component="span">
            Error: {error?.response?.status} ({error?.response?.statusText})
          </Box>
          <Box component="span">Message: {error?.response?.data?.message}</Box>
        </Box>
      )}
    </Box>
  );
}
