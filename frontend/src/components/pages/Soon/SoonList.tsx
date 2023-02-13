import { Box, Stack } from "@mui/material";
import { useState } from "react"
import { Button, makeStyles, TextField } from "@material-ui/core";
import UserCard from '@layout/Card';

export default function SoonList() {
  return(
  <Box>
    <Stack direction={"row"}>
      <Box>
        {MySoon()}
      </Box>
    </Stack>
    <Stack direction={"row"}>
      <Box>
        {SoonAddButton()}
      </Box>
      <Box>
        {SoonDeleteButton()}
      </Box>
    </Stack>
  </Box> 
  );
};


export function MySoon(){
  const soonwoon = [
    { swid: 1, nickname: '순원1', pictureUrl: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20150403_67%2Fe2voo_14280514292377Sadp_JPEG%2Fkakako-03.jpg&type=a340", campus:"충북대", major:"국문",sid:"2021039034" },
    { swid: 2, nickname: '순원2', pictureUrl: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20150403_67%2Fe2voo_14280514292377Sadp_JPEG%2Fkakako-03.jpg&type=a340",campus:"충북대", major:"영문",sid:"2021038034" },
    // ...
  ];

  return (
    <div>
      { soonwoon.map((soonwoon) => (
        <UserCard
          key={soonwoon.swid}
          swid={soonwoon.swid}
          nickname={soonwoon.nickname}
          pictureUrl={soonwoon.pictureUrl}
          campus={soonwoon.campus}
          major={soonwoon.major}
          sid={soonwoon.sid}
        />
      )) }
    </div>
  );
};

function SoonAddButton() {
  const buttonStyle = {
    size: "small",
    width: '30px',
    height: '23px'
  };

  const [textFieldOpen, setTextFieldOpen] = useState(false);
  const [text, setText] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // const response = await axios.post("http://13.125.79.139/", {Body: {sjid: "내 순장id", swid: Number(text)/*<-순원id로 추가*/}});
      // console.log(response.data);
      const response = text
      console.log("순원 추가 >>", text);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <Box>
      <Button 
          variant="contained" 
          color="primary" 
          style={buttonStyle}
          onClick = {() => {
            setTextFieldOpen(!textFieldOpen)
          }}
      >+</Button>
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

function SoonDeleteButton() {
  const buttonStyle = {
    size: "small",
    width: '30px',
    height: '23px'
  };

  const [textFieldOpen, setTextFieldOpen] = useState(false);
  const [text, setText] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // const response = await axios.delete("http://13.125.79.139/", {Body: {sjid: "내 순장id", swid: Number(text)/*<-순원id로 추가*/}});
      // console.log(response.data);
      const response = text
      console.log("순원 삭제 >>",text);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <Box>
      <Button 
          variant="contained" 
          color="primary" 
          style={buttonStyle}
          onClick = {() => {
            setTextFieldOpen(!textFieldOpen)
          }}
      >-</Button>
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