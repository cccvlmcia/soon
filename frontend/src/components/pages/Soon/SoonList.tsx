import {useState, useEffect} from "react";
import {useRecoilValue} from "recoil";

import {Box, Stack} from "@mui/material";
import {Button, TextField} from "@mui/material";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";
import {UserCard} from "@layout/Card";
import {api} from "@recoils/consonants";
import {getSoonListQuery} from "@recoils/api/Soon";
import {userState} from "@recoils/user/state";
import {styles} from "@layout/styles";

export default function SoonList() {
  const loginUser: any = useRecoilValue(userState);
  console.log("loginUser >", loginUser?.userid);
  const userid = loginUser?.userid || 1;
  const [soonlist, setSoonlist] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const {isLoading, isError, data, error} = getSoonListQuery(userid);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  const datalist: never[] = data;
  useEffect(() => {
    if (datalist) {
      listFunc();
    }
  }, [data, setSoonlist]);
  const listFunc = () => {
    setSoonlist([...datalist]);
  };
  return (
    <Box>
      <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10px"}}>
        {soonlist?.map(({soonid, soonwon}: any) => (
          <UserCard key={soonid} userid={soonwon.userid} nickname={soonwon.nickname} />
        ))}
      </Box>
      {/*FIXME: 순원 추가/삭제는 관리자 권한! */}
      {/* <Stack direction={"row"}>
        <SoonAddButton sjid={userid} setSoonlist={setSoonlist} textFieldOpen={addOpen} setTextFieldOpen={setAddOpen} />
        <SoonDeleteButton sjid={userid} setSoonlist={setSoonlist} textFieldOpen={delOpen} setTextFieldOpen={setDelOpen} />
      </Stack> */}
    </Box>
  );
}

function SoonAddButton({
  sjid,
  setSoonlist,
  textFieldOpen,
  setTextFieldOpen,
}: {
  sjid: number;
  setSoonlist: any;
  textFieldOpen: boolean;
  setTextFieldOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [text, setText] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleAdd = async () => {
    const swid = Number(text);
    const result = await api.post("/soon", {sjid, swid});
    if (result) {
      setSoonlist((list: any) => [...list, result.data]);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        sx={styles.soon.button}
        onClick={() => {
          setTextFieldOpen(!textFieldOpen);
        }}>
        +
      </Button>
      {/* FIXME: 순원추가 버튼 > Full-screen dialogs에서 전체 캠퍼스 사용자 중에 선택하는 걸로 */}
      {textFieldOpen && (
        <Box onClick={handleAdd}>
          <TextField label="순원id를 입력해주세요" value={text} onChange={handleChange} />
          <Button type="submit" variant="contained">
            순원추가
          </Button>
        </Box>
      )}
    </Box>
  );
}

function SoonDeleteButton({
  sjid,
  setSoonlist,
  textFieldOpen,
  setTextFieldOpen,
}: {
  sjid: number;
  setSoonlist: any;
  textFieldOpen: boolean;
  setTextFieldOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [text, setText] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
  const handleDelete = async () => {
    const swid = Number(text);
    const result = await api.delete(`/soon/${sjid}/${swid}`);
    if (result) {
      setSoonlist((list: any) => list.filter((soon: any) => soon.swid != swid));
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        sx={styles.soon.button}
        onClick={() => {
          setTextFieldOpen(!textFieldOpen);
        }}>
        -
      </Button>
      {textFieldOpen && (
        <Box onClick={handleDelete}>
          <TextField label="순원id를 입력해주세요" value={text} onChange={handleChange} />
          <Button variant="contained">순원삭제</Button>
        </Box>
      )}
    </Box>
  );
}
