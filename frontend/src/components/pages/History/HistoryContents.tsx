import { styles } from "@layout/styles";
import { Button, Checkbox, ListItemText, MenuItem, Select, TextField } from "@material-ui/core";
import {Box} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { getSoonHistoryQuery } from "@recoils/api/Soon";
import { api } from "@recoils/consonants";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export default function HistoryContents() {
    const urlParams = new URL(location.href).searchParams;
    const historyid = Number(urlParams.get("historyid"));
    const {data} = getSoonHistoryQuery(historyid);
    console.log("data >>", data);
    return <Box>HistoryContents</Box>;
};

