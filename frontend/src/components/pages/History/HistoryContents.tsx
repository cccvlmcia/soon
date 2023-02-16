import { styles } from "@layout/styles";
import { Button, Checkbox, ListItemText, MenuItem, Select, TextField } from "@material-ui/core";
import {Box} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { getSoonHistoryQuery } from "@recoils/api/Soon";
import Error from "components/Error/Error";
import Loading from "components/Loading/Loading";

export default function HistoryContents() {
    const urlParams = new URL(location.href).searchParams;
    const historyid = Number(urlParams.get("historyid"));
    const {isLoading, isError, data, error} = getSoonHistoryQuery(historyid)
    if (isLoading) {
        return <Loading />;
    }
    if (isError) {
        return <Error error={error} />;
    } console.log("data >>", data);
    return <Box>HistoryContents</Box>;
};

