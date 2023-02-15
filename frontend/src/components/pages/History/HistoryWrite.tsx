import {Box, Button, Checkbox, FormControlLabel, TextField} from "@mui/material";
import {postSoon} from "@recoils/user/axios";

import {ChangeEvent, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";

type FormData = {
  giver: string;
  kind: string;
  progress: string;
  taker: string;
  date: string;
  contents: string;
  prays: {pray: string; publicyn: boolean}[];
};

export default function HistoryWrite() {
  const [textFields, setTextFields] = useState<{pray: string; publicyn: boolean}[]>([]);
  const {register, handleSubmit, setValue, getValues} = useForm<FormData>();

  const handleAddTextField = () => {
    setTextFields([...textFields, {pray: "", publicyn: true}]);
  };

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValues = [...textFields];
    newValues[index].pray = event.target.value;
    setTextFields(newValues);
    setValue("prays", newValues); // Update the value of the 'prays' field in the form data object
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValues = [...textFields];
    newValues[index].publicyn = event.target.checked;
    setTextFields(newValues);
    setValue("prays", newValues); // Update the value of the 'prays' field in the form data object
  };

  const writeSoon: SubmitHandler<FormData> = async (params: FormData) => {
    const soonInfo = {
      userid: 70,
      sjid: 70,
      swid: 70,
      kind: params.kind,
      progress: params.progress,
      //FIXME: Date로 받도록 할 것
      historydate: new Date(),
      contents: params.contents,
      //FIXME: pray의 publiccyn이거 boolean 값으로 바꿀 것
      prays: null,
    };
    console.log("Form data:", soonInfo);
    await postSoon(soonInfo);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(writeSoon)}>
      <Box>
        <Box>해준 사람</Box>
        <TextField {...register("giver")} />
      </Box>
      <Box>
        <Box>분류</Box>
        <TextField {...register("kind")} />
      </Box>
      <Box>
        <Box>진도</Box>
        <TextField {...register("progress")} />
      </Box>
      <Box>
        <Box>받은 사람</Box>
        <TextField {...register("taker")} />
      </Box>
      <Box>
        <Box>날짜</Box>
        <TextField {...register("date")} />
      </Box>
      <Box>
        <Box>내용</Box>
        <TextField multiline rows={4} {...register("contents")} />
      </Box>
      <Box>
        {textFields.map((value, index) => (
          <Box key={index}>
            <TextField value={value.pray} onChange={(event: ChangeEvent<HTMLInputElement>) => handleTextFieldChange(event, index)} />
            <FormControlLabel
              control={<Checkbox checked={value.publicyn} onChange={event => handleCheckboxChange(event, index)} name={`publicyn-${index}`} />}
              label="Public"
            />
          </Box>
        ))}
        <Button onClick={handleAddTextField}>기도 제목을 추가하세요~</Button>
      </Box>
      <Box>
        <Button type="submit">저장</Button>
      </Box>
    </Box>
  );
}
