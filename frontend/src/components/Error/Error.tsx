import {Box} from "@mui/material";
import {server} from "@recoils/constants";
import {userState} from "@recoils/user/state";
import Loading from "components/Loading/Loading";
import {useNavigate, useLocation} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {Navigate} from "react-router-dom";

export default function Error({error}: any) {
  const loginUser = useRecoilValue(userState);
  const location = useLocation();
  const navigate = useNavigate();
  if (Number(error?.response?.status) > 500) {
    if (loginUser) {
      server
        .post("/auth/refreshToken")
        .then(data => {
          if (data?.data == "USER_AUTHENTICATED") {
            navigate(0);
          }
          const {pathname} = location;

          if (pathname) {
          }
        })
        .catch(err => {
          console.log("refreshToken err >", err);
          return <Navigate to="/login" />;
        });
      return <Loading />;
    } else {
      console.error(" loginUser 여기! ", error);
      return <Navigate to="/login" />;
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
