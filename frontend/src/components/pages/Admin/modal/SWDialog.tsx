import React, {useState, useEffect} from "react";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import {TransitionProps} from "@mui/material/transitions";
import {Box, Checkbox, ListItemButton} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import {api} from "@recoils/constants";
import {deleteSoon} from "@recoils/soon/axios";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

//기존 리스트 삭제(campusid로?), 변경된거 추가 이렇게 해야하네...
export default function SWDialog({
  open,
  setOpen,
  items,
  selectedId,
  handleOK,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  items: any[];
  selectedId: any;
  handleOK: any;
}) {
  const [list, setList]: any = useState([]);

  useEffect(() => {
    const _items = items?.filter(({user}: any) => user?.sw?.filter(({sjid}: any) => sjid == selectedId)?.length > 0);
    setList(_items);
  }, [selectedId]);
  const handleClose = () => {
    setOpen(false);
  };

  const handleItem = () => {
    setOpen(false);
    handleOK(list);
  };
  const onChangeSW = async (item: any) => {
    const idx = list?.findIndex((obj: any) => obj.userid == item?.userid);
    if (idx > -1) {
      await deleteSoon(selectedId, item?.userid);

      setList([...list.slice(0, idx), ...list.slice(idx + 1, list.length)]);
    } else {
      await api.post(`/soon`, {sjid: selectedId, swid: item?.userid});
      setList([...list, item]);
    }
  };

  const itemList = items?.map(item => {
    /* disabled 조건 > 나 또는 이미 순장이 있을때*/
    // console.log("item >>", item)
    const isMe = item?.userid == selectedId;
    const hasSJ = item?.user?.sw?.length > 0 ? item?.user?.sw?.filter(({sjid}: any) => sjid != selectedId)?.length > 0 : false;
    const mySJ = item?.user?.sj?.length > 0 ? item?.user?.sj?.filter(({swid}: any) => swid == selectedId)?.length > 0 : false;
    const disabled = isMe || hasSJ || mySJ;
    const soonjang = item?.user?.sw
      ?.filter(({sjid}: any) => sjid != selectedId)
      ?.map(({soonjang}: any) => "(" + soonjang.nickname + ")")
      .join();
    // console.log("item user", soonjang);
    return (
      <Box key={item?.userid}>
        <ListItemButton onClick={() => onChangeSW(item)} disabled={disabled}>
          <IconButton edge="start">
            <Checkbox checked={list?.find((obj: any) => obj?.userid == item?.userid) ? true : false} />
          </IconButton>
          <ListItemText primary={`${item?.user?.nickname}${soonjang}`} secondary={`${String(item?.sid).padStart(2, "0")}학번 / ${item?.major}`} />
        </ListItemButton>
        <Divider />
      </Box>
    );
  });
  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{position: "relative"}}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
              순원 선택
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleItem} aria-label="close">
              <CheckIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <List>{itemList}</List>
      </Dialog>
    </div>
  );
}
