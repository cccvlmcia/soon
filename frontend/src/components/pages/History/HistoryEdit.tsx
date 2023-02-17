import {styles} from "@layout/styles";
import {Box, Checkbox, ListItemText, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {getSoonHistoryQuery} from "@recoils/soon/query";
import Error from "components/Error/Error";
import Loading from "components/Loading/Loading";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
type Prayer = {
  pray: string;
  publicyn: string;
};
type FormData = {
  sjid: string;
  swid: string;
  kind: string;
  progress: string;
  historydate: Date;
  contents: string;
  prayer: string;
  prays: Prayer[];
};

type User = {
  userid: string;
  nickname: string;
};

type Category = {
  id: string;
  name: string;
};
export default function HistoryEdit() {
  const {historyid} = useParams();
  const {isLoading, isError, data, error} = getSoonHistoryQuery(Number(historyid));
  console.log("history Contents", historyid, data);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  const {register, handleSubmit, setValue, getValues} = useForm<FormData>();

  const [soonjang, setSoonjang] = useState<User>(data.soonjang);
  const [soonwon, setSoonwon] = useState<User>(data.soonwon);
  const [categoryList, setCategoryList] = useState<Category[]>([
    {id: "soon", name: "순모임"},
    {id: "coffee", name: "커피 타임"},
    {id: "activity", name: "외부 활동"},
    {id: "unity", name: "합동 순모임"},
  ]);
  const [categorySelected, setCategorySelected] = useState<Category | null>(null);

  const handleCategoryReceive = (event: React.ChangeEvent<{value: unknown}>) => {
    const value = event.target.value as Category;
    setCategorySelected(value);
  };

  const sendHistory = () => {};

  return (
    <Box>
      <Box>History Edit</Box>
      <Box
        component="form"
        onSubmit={handleSubmit(sendHistory)}
        sx={[
          historyid ? styles.mobile.container : styles.web.container,
          styles.web.writeform,
          {
            ".row": {display: "flex", alignItems: "center", marginTop: "5px"},
            ".header": {width: "120px", textAlign: "right", paddingRight: "10px", fontSize: "16px"},
          },
        ]}>
        <Box>{soonjang.nickname}</Box>
        <Box>{soonwon.nickname}</Box>
        <Box className="row">
          <Box className="header">분류</Box>
          <Select
            size="small"
            value={categorySelected?.name || ""}
            fullWidth
            onChange={handleCategoryReceive as never}
            renderValue={selected => {
              console.log(selected);
              return selected;
            }}>
            {/* FIXME: Category타입 지정시 에러 */}
            {categoryList.map((category: any, index: number) => (
              <MenuItem key={index} value={category}>
                <Checkbox checked={categorySelected?.id === category.id} />
                <ListItemText primary={category.name} />
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </Box>
  );
}
