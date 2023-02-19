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
import {Box, ListItemButton} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SWDialog from "./SWDialog";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UserDialog({
  open,
  setOpen,
  items,
  selected,
  campus,
  handleOK,
  refetch,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  items: any[];
  selected: any;
  campus: any;
  handleOK: any;
  refetch: any;
}) {
  const [list, setList]: any = useState([]);
  const [selectedId, setSelectedId]: any = useState(null);
  const [swopen, setSwOpen] = useState(false);

  useEffect(() => {
    setList(selected);
  }, [selected]);
  const handleClose = () => {
    setOpen(false);
    setList(selected);
  };

  const onClickSW = (userid: string) => {
    setSwOpen(true);
    setSelectedId(userid);
  };

  const handleItem = () => {
    refetch();
  };
  const itemList = items?.map(item => (
    <Box key={item?.userid}>
      <ListItemButton onClick={() => onClickSW(item?.userid)}>
        <ListItemText
          primary={item?.user?.nickname + `${item?.user?.sw?.length ? "(" + item?.user?.sw?.map(({soonjang}: any) => soonjang?.nickname) + ")" : ""}`}
          secondary={item?.user?.sj?.map(({soonwon}: any) => soonwon?.nickname).join(", ")}
        />
        <IconButton edge="end">
          <ArrowForwardIosIcon />
        </IconButton>
      </ListItemButton>
      <Divider />
    </Box>
  ));
  return (
    <>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{position: "relative"}}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
              순장 목록
            </Typography>
          </Toolbar>
        </AppBar>
        <List>{itemList}</List>
      </Dialog>
      {/* 순장의 순원 목록 / 선택하고 확인 누르면 반영 하는데 Admin 에서 [{sj:[sw]}}]으로 던저야 함. */}
      {/* 캠퍼스 유저중에 순장 있는 사람들.... */}
      <SWDialog open={swopen} setOpen={setSwOpen} items={items} selectedId={selectedId} handleOK={handleItem} />
    </>
  );
}
