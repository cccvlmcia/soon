import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { useRecoilValue } from "recoil";

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
import { userState } from "@recoils/user/state";

export default function App() {
  const loginUser = useRecoilValue(userState);
  return (
    <Box>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={Auth(Home, null)}></Route>
          <Route path="/login" element={Auth(Login, null)}></Route>
          <Route path="/register" element={Auth(Register, null)}></Route>
          <Route
            path="/register/:userid"
            element={Auth(Register, null)}
          ></Route>
          <Route path="/campus" element={Auth(Campus, null)}></Route>
          <Route path="/history" element={Auth(HistoryWrite, null)}></Route>
          <Route
            path="/history/:historyid"
            element={Auth(HistoryWrite, null)}
          ></Route>
          <Route
            path="/soon/:userid/card"
            element={Auth(SoonCard, null)}
          ></Route>
          <Route path="/soon/list" element={Auth(SoonList, null)}></Route>
          <Route path="/soon/graph" element={Auth(SoonGraph, null)}></Route>
          <Route path="/admin" element={Auth(Admin, null)}></Route>
          <Route path="/myprofile/:userid" element={Auth(MyProfile, null)}></Route>
        </Route>
      </Routes>
    </Box>
  );
}
