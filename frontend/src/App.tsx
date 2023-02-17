import {Suspense} from "react";
import {Box} from "@mui/material";
import {Routes, Route} from "react-router-dom";

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
import {useRecoilValue} from "recoil";
import Loading from "components/Loading/Loading";
import {userState} from "@recoils/user/state";
import MenuHeader from "@layout/header/MenuHeader";
import BlankHeader from "@layout/header/BlankHeader";
import PrevHeader from "@layout/header/PrevHeader";
import HistoryEdit from "@pages/History/HistoryEdit";
import HistoryContents from "@pages/History/HistoryContents";

export default function App() {
  return (
    //App 최초 로딩 fallback
    <Suspense fallback={<Loading />}>
      <AppRoutes />
    </Suspense>
  );
}

function AppRoutes() {
  const loginUser = useRecoilValue(userState);

  return (
    <Box>
      <Routes>
        <Route
          element={
            <Layout>
              <MenuHeader />
            </Layout>
          }>
          {/*Login */}
          <Route path="/" element={Auth(Home, true, loginUser)}></Route>
          <Route path="/campus" element={Auth(Campus, true, loginUser)}></Route>
          <Route path="/soon/list" element={Auth(SoonList, true, loginUser)}></Route>
          <Route path="/withdrawal" element={Auth(Withdrawal, true, loginUser)}></Route>
        </Route>

        <Route
          element={
            <Layout>
              <PrevHeader />
            </Layout>
          }>
          <Route path="/soon/card/:userid" element={Auth(SoonCard, true, loginUser)}></Route>

          <Route path="/history/:historyid/view" element={Auth(HistoryContents, true, loginUser)}></Route>
        </Route>

        <Route
          element={
            <Layout>
              <BlankHeader />
            </Layout>
          }>
          <Route path="/login" element={Auth(Login, false)}></Route>
          <Route path="/register" element={Auth(Register, null)}></Route>
        </Route>
        {/* Custom AppBar */}
        <Route path="/myprofile/:userid" element={Auth(MyProfile, true, loginUser)}></Route>
        <Route path="/history" element={Auth(HistoryWrite, true, loginUser)}></Route>
        {/* Custom AppBar */}

        {/* 이건 왜 필요?? */}
        <Route path="/admin" element={Auth(Admin, true, loginUser)}></Route>
        <Route path="/history/:historyid/edit" element={Auth(HistoryEdit, true, loginUser)}></Route>
        <Route path="/register/:userid" element={Auth(Register, null)}></Route>
        <Route path="/history/:historyid" element={Auth(HistoryWrite, true, loginUser)}></Route>
        <Route path="/soon/graph" element={Auth(SoonGraph, true, loginUser)}></Route>
      </Routes>
    </Box>
  );
}
