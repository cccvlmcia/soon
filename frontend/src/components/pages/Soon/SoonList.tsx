import {Box, Stack} from "@mui/material";
import {useState} from "react";
import {Button, TextField} from "@mui/material";
import {UserCard} from "@layout/Card";
import {getSoonListQuery} from "@recoils/api/Soon";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";
import {api} from "@recoils/consonants";
import {useRecoilValue} from "recoil";
import {userState} from "@recoils/user/state";

export default function SoonList() {
  const loginUser: any = useRecoilValue(userState);
  console.log("loginUser >", loginUser?.userid);
  const userid = loginUser?.userid || 1; //TODO: user#
  return (
    <Box>
      <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10px"}}>
        <MySoon userid={userid} />
      </Box>
      <Stack direction={"row"}>
        <SoonAddButton userid={userid} />
        <SoonDeleteButton userid={userid} />
      </Stack>
    </Box>
  );
}

function MySoon({userid}: any) {
  const {isLoading, isError, data, error} = getSoonListQuery(userid);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  return (
    <Box>
      {data?.map(({soonid, soonwon}: any) => (
        <UserCard key={soonid} userid={soonwon.userid} nickname={soonwon.nickname} />
      ))}
    </Box>
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const swid = Number(text);
    const sjid = userid;
    const result = await api.post("/soon", {sjid, swid});
    if (result) {
      console.log("result >> ", result);
    }
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
      {/* FIXME: 순원추가 버튼 > Full-screen dialogs에서 전체 캠퍼스 사용자 중에 선택하는 걸로 */}
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
    api.delete(`/soon/${sjid}/${swid}`);
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
