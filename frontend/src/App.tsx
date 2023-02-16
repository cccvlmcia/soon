import {Box} from "@mui/material";
import {Routes, Route} from "react-router-dom";

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

export default function App() {
  return (
    <Box>
      <Routes>
        <Route element={<Layout />}>
          {/*Login */}
          <Route path="/" element={Auth(Home, true)}></Route>
          <Route path="/campus" element={Auth(Campus, true)}></Route>
          {/*Login */}

          {/*Not Login */}
          <Route path="/login" element={Auth(Login, null)}></Route>
          <Route path="/register" element={Auth(Register, null)}></Route>
          <Route path="/register/:userid" element={Auth(Register, null)}></Route>
          <Route path="/history" element={Auth(HistoryWrite, null)}></Route>
          <Route path="/history/:historyid" element={Auth(HistoryWrite, null)}></Route>
          <Route path="/historycontents" element={Auth(HistoryContents, null)}></Route>
          <Route path="/soon/:userid/card" element={Auth(SoonCard, null)}></Route>
          <Route path="/soon/list" element={Auth(SoonList, null)}></Route>
          <Route path="/soon/graph" element={Auth(SoonGraph, null)}></Route>
          <Route path="/admin" element={Auth(Admin, null)}></Route>
          <Route path="/myprofile/:userid" element={Auth(MyProfile, null)}></Route>
          <Route path="/withdrawal" element={Auth(Withdrawal, null)}></Route>
          {/*Not Login */}
        </Route>
      </Routes>
    </Box>
  );
}
