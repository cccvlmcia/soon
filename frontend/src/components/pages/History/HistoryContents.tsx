import {Box} from "@mui/material";
import { getSoonHistoryQuery } from "@recoils/api/Soon";

export default function HistoryContents() {
    const urlParams = new URL(location.href).searchParams;
    const historyid = 1
    //Number(urlParams.get("historyid"));
    const {data} = getSoonHistoryQuery(historyid)
    console.log("data >>", data);
    return <Box>HistoryContents</Box>;
};
