import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {styles} from "@layout/styles";

export default function HistoryWrite() {
  const navigate = useNavigate();
  const { historyid } = useParams();

  historyid ? console.log("history id >> ", historyid) : "";
  const { register, handleSubmit } = useForm<FormData>(); //user
  const [userList, setUserList] = useState<Object[]>([]);
  const [selected, setSelected] = useState<String[]>([]);

  const handleReceive = (event: SelectChangeEvent<never[]>) => {
    const value = event.target.value as string;
    setSelected(typeof value === "string" ? value.split(",") : value);
  };

  const writeHistory = async (params: any) => {
    console.log("params >> ", params);
    const result = await axios.post(`/history`, params);
    if (result) {
      navigate("/");
    } else {
      console.log("SERVER에서 응답하지 않습니다");
    }
  };
  type FormData = {
    soonjang: string;
    category: string;
    progress: string;
    date: string;
    contens: string;
    prayer: string;
    contents: string;
  };
  // 중간에 발생하는 값의 변화를 탐지하기 위함
  useEffect(() => {
    userListFunc();
  }, [historyid]);

  const userListFunc = () => {
    setUserList([
      { userid: "1", name: "김이박" },
      { userid: "2", name: "고범수" },
      { userid: "3", name: "주님" },
    ]);
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(writeHistory)}
      sx={[historyid ? styles.mobile.container:styles.web.container,styles.web.writeform]}
    >
      <Box>순모임 히스토리 기록</Box>
      <Box>
        해준 사람 <TextField {...register("soonjang")} />
      </Box>
      <Box>
        분류 <TextField {...register("category")} />
      </Box>
      <Box>
        진도 <TextField {...register("progress")} />
      </Box>
      <Box>
        받은 사람{" "}
        {/* {userList.map((user, index) => (
            <MenuItem key={index} value={user.userid}>
              {user.name}
            </MenuItem>
          ))} */}
        <Select
          value={selected as never}
          fullWidth
          multiple
          onChange={handleReceive}
          renderValue={(selected) => selected.join(", ")}
        >
          {userList.map((user: any, index: number) => (
            <MenuItem key={index} value={user.name}>
              //TODO: 중괄호와 소괄호의 차이 이 부분이 출력 되네
              <Checkbox
                checked={selected.indexOf(user.name.toString()) > -1}
              ></Checkbox>
              <ListItemText primary={user.name}></ListItemText>
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        날짜 <TextField {...register("date")} />{" "}
      </Box>
      <Box>내용</Box>
      <Box>
        <TextField multiline rows={4} {...register("contents")} />
      </Box>
      <Box>기도제목</Box>
      <Box>
        <TextField {...register("prayer")} />
      </Box>
      <Box>
        <Button type="submit">저장</Button>
      </Box>
    </Box>
  );
}