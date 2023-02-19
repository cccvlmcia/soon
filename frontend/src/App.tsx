import {Suspense, useEffect} from "react";
import {Box} from "@mui/material";
import {Routes, Route, Navigate, useNavigate, useLocation} from "react-router-dom";

import Layout from "@layout/Layout";
import Home from "@pages/Home";
import Login from "@pages/Login/Login";
import Auth from "@hoc/Auth";
import Register from "@pages/Register/Register";
import Campus from "@pages/Campus/Campus";
import HistoryWrite from "@pages/History/HistoryWrite";

import SoonCard from "@pages/Soon/SoonCard";
import SoonList from "@pages/Soon/SoonList";
import SoonGraph from "@pages/Soon/SoonGraph";
import Admin from "@pages/Admin/Admin";
import MyProfile from "@pages/MyProfile/MyProfile";
import Withdrawal from "@pages/Withdrawal/Withdrawal";
import {useRecoilState, useRecoilValue} from "recoil";
import Loading from "components/Loading/Loading";
import {userState} from "@recoils/user/state";
import MenuHeader from "@layout/header/MenuHeader";
import BlankHeader from "@layout/header/BlankHeader";
import PrevHeader from "@layout/header/PrevHeader";
import HistoryEdit from "@pages/History/HistoryEdit";
import HistoryContents from "@pages/History/HistoryContents";
import {selectedCampusState} from "@recoils/campus/state";
import AddMyProfile from "@pages/MyProfile/AddMyProfile";
import {getAuthUserQuery} from "@recoils/user/query";
import Error from "components/Error/Error";

export default function App() {
  return (
    //App 최초 로딩 fallback
    <Suspense fallback={<Loading />}>
      <AppRoutes />
    </Suspense>
  );
}

function AppRoutes() {
  const {isLoading, isError, data, error} = getAuthUserQuery();

  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const [campusSelected, setCampusSelected]: any = useRecoilState(selectedCampusState);
  useEffect(() => {
    if (loginUser == null && data != null) {
      setLoginUser(data);
    }
  }, [data]);

  useEffect(() => {
    if (campusSelected == null) {
      setCampusSelected(loginUser?.campus[0]?.campus);
    }
  }, [loginUser]);
  if (isError) {
    return <Error error={error} />;
  }
  if (isLoading) {
    return <Loading />;
  }
  const user = loginUser || data;
  return (
    <Box>
      <Routes>
        <Route
          element={
            <Layout
              sx={{
                ".MuiAppBar-root, .MuiToolbar-root, .MuiToolbar-gutters, .MuiToolbar-regular, .css-hyum1k-MuiToolbar-root, .MuiPaper-root": {
                  boxShadow: "transparent !important",
                },
              }}>
              <MenuHeader />
            </Layout>
          }>
          <Route path="/" element={Auth(Home, true, user)}></Route>
          <Route path="/campus" element={Auth(Campus, true, user)}></Route>
          <Route path="/soon/list" element={Auth(SoonList, true, user)}></Route>
          <Route path="/withdrawal" element={Auth(Withdrawal, true, user)}></Route>
        </Route>

        <Route
          element={
            <Layout>
              <PrevHeader />
            </Layout>
          }>
          <Route path="/soon/card/:userid" element={Auth(SoonCard, true, user)}></Route>
        </Route>

        <Route
          element={
            <Layout>
              <BlankHeader />
            </Layout>
          }>
          <Route path="/login" element={Auth(Login, false)}></Route>
        </Route>
        {/* Custom AppBar */}
        <Route path="/register" element={Auth(Register, null)}></Route>
        <Route path="/myprofile" element={Auth(MyProfile, true, user)}></Route>
        <Route path="/myprofile/add" element={Auth(AddMyProfile, true, user)}></Route>
        <Route path="/history" element={Auth(HistoryWrite, true, user)}></Route>
        <Route path="/history/:historyid" element={Auth(HistoryContents, true, user)}></Route>
        <Route path="/admin" element={Auth(Admin, true, user)}></Route>
        {/* Custom AppBar */}

        {/* 이건 왜 필요?? */}
        {/* <Route path="/history/:historyid" element={Auth(HistoryWrite, true, loginUser)}></Route> */}
        {/* <Route path="/soon/graph" element={Auth(SoonGraph, true, loginUser)}></Route> */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Box>
  );
}
