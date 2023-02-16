import {Box, Stack} from "@mui/material";
import {useState} from "react";
import {Button, makeStyles, TextField} from "@material-ui/core";
import {UserCard} from "@layout/Card";
import { getSoonIdQuery, getSoonListQuery } from "@recoils/api/Soon";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";
import axios from "axios";
import { api } from "@recoils/consonants";

export default function SoonList() {
  const userid = 2 //TODO: user#
  return (
    <Box>
      <Stack direction={"row"}>
        <Box><MySoon userid = {userid}/></Box>
      </Stack>
      <Stack direction={"row"}>
        <Box><SoonAddButton userid = {userid}/></Box>
        <Box><SoonDeleteButton userid = {userid}/></Box>
      </Stack>
    </Box>
  );
}

function MySoon({userid}: any) {
  const {isLoading, isError, data, error} = getSoonListQuery(userid)
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  return (
    <div>
      {data?.map((
        {soonid, soonwon}: any) => (
        <UserCard
          key={soonid}
          userid={soonwon.userid}
          nickname={soonwon.nickname}
        />
      ))}
    </div>
  );
}

function SoonAddButton({userid}: any) {
  const buttonStyle = {
    size: "small",
    width: "30px",
    height: "23px",
  };

  const [textFieldOpen, setTextFieldOpen] = useState(false);
  const [text, setText] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const swid = Number(text);
    const sjid = userid;
    api.post("/soon", {sjid, swid})

  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        style={buttonStyle}
        onClick={() => {
          setTextFieldOpen(!textFieldOpen);
        }}>
        +
      </Button>
      {textFieldOpen && (
        <form onSubmit={handleSubmit}>
          <TextField label="순원id를 입력해주세요" value={text} onChange={handleChange} />
          <Button type="submit" variant="contained">
            순원추가
          </Button>
        </form>
      )}
    </Box>
  );
}

function SoonDeleteButton({userid}: any) {
  const buttonStyle = {
    size: "small",
    width: "30px",
    height: "23px",
  };

  const [textFieldOpen, setTextFieldOpen] = useState(false);
  const [text, setText] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const swid = Number(text);
    const sjid = userid;
    api.delete(`/soon/${sjid}/${swid}`)
    event.preventDefault();
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        style={buttonStyle}
        onClick={() => {
          setTextFieldOpen(!textFieldOpen);
        }}>
        -
      </Button>
      {textFieldOpen && (
        <form onSubmit={handleSubmit}>
          <TextField label="순원id를 입력해주세요" value={text} onChange={handleChange} />
          <Button type="submit" variant="contained">
            순원삭제
          </Button>
        </form>
      )}
    </Box>
  );
}
