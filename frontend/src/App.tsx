import {Suspense, useEffect} from "react";
import {Box} from "@mui/material";
import {Routes, Route, Navigate, useNavigate} from "react-router-dom";

import Layout from "@layout/Layout";
import Home from "@pages/Home";
import Login from "@pages/Login/Login";
import Auth from "@hoc/Auth";
import Register from "@pages/Register/Register";
import Campus from "@pages/Campus/Campus";
import HistoryWrite from "@pages/History/HistoryWrite";
import HistoryContents from "@pages/History/HistoryContents";
import SoonCard from "@pages/Soon/SoonCard";
import SoonList from "@pages/Soon/SoonList";
import SoonGraph from "@pages/Soon/SoonGraph";
import Admin from "@pages/Admin/Admin";
import MyProfile from "@pages/MyProfile/MyProfile";
import Withdrawal from "@pages/Withdrawal/Withdrawal";
import {userGoogleAuthState} from "@recoils/login/state";
import {useRecoilState, useRecoilValue} from "recoil";
import Loading from "components/Loading/Loading";
import {userState, userSelector} from "@recoils/user/state";
import {campusState} from "@recoils/campus/state";

export default function App() {
  return (
    //App 최초 로딩 fallback
    <Suspense fallback={<Loading />}>
      <AppRoutes />
    </Suspense>
  );
}

function AppRoutes() {
  const googleAuth = useRecoilValue(userGoogleAuthState);
  const campusList = useRecoilValue(campusState);
  const [loginUser, setLoginUser] = useRecoilState(userState);
  const authUser = useRecoilValue(userSelector);
  useEffect(() => {
    if (loginUser == null || loginUser == "") {
      setLoginUser(authUser);
    }
  }, [authUser]);

  return (
    <Box>
      <Routes>
        <Route element={<Layout />}>
          {/*Login */}
          <Route path="/" element={Auth(Home, true, loginUser || authUser)}></Route>
          <Route path="/campus" element={Auth(Campus, true, loginUser || authUser)}></Route>
          <Route path="/myprofile/:userid" element={Auth(MyProfile, true, loginUser || authUser)}></Route>
          <Route path="/admin" element={Auth(Admin, true, loginUser || authUser)}></Route>
          <Route path="/history" element={Auth(HistoryWrite, true, loginUser || authUser)}></Route>
          <Route path="/history/:historyid" element={Auth(HistoryWrite, true, loginUser || authUser)}></Route>
          <Route path="/history/:historyid/view" element={Auth(HistoryContents, true, loginUser || authUser)}></Route>
          <Route path="/soon/:userid/card" element={Auth(SoonCard, true, loginUser || authUser)}></Route>
          <Route path="/soon/list" element={Auth(SoonList, true, loginUser || authUser)}></Route>
          <Route path="/soon/graph" element={Auth(SoonGraph, true, loginUser || authUser)}></Route>
          <Route path="/withdrawal" element={Auth(Withdrawal, true, loginUser || authUser)}></Route>

          {/*Login */}

          {/*Not Login */}
          <Route path="/login" element={Auth(Login, false)}></Route>
          {/*Not Login */}

          {/*EveryOne */}
          <Route path="/register" element={Auth(Register, null)}></Route>
          {/* // element={isRegistered() ? <Navigate to={"/"} /> : Auth(Login, null)}></Route> */}
          <Route path="/register/:userid" element={Auth(Register, null)}></Route>
          {/*EveryOne */}
        </Route>
      </Routes>
    </Box>
  );
}
