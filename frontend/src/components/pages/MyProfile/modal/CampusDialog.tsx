import React, {useState} from "react";
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
import CheckIcon from "@mui/icons-material/Check";
import NoData from "@common/NoData";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//TODO: 캠퍼스 삭제도 추가
// 캠퍼스 추가를 여기에 붙일까? 싶기도하고?
export default function CampusDialog({
  open,
  setOpen,
  items,
  campusSelected,
  handleCampus,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  items: any[];
  campusSelected: any;
  handleCampus: any;
}) {
  // campuslist ,setcampuslist
  const handleClose = () => {
    setOpen(false);
  };
  const handleItem = (campus: any) => {
    setOpen(false);
    handleCampus(campus);
  };

  const itemList = items?.map(item => (
    <Box key={item?.campusid} sx={{padding: "0 10px"}}>
      <ListItemButton onClick={() => handleItem(item)}>
        {item?.campusid == campusSelected?.campusid && <CheckIcon />}
        <ListItemText primary={item?.name} secondary={item?.campusid} />
      </ListItemButton>
      <Divider />
    </Box>
  ));
  return (
    <>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{position: "relative", backgroundColor: "#000000!important", color: "white!important"}}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Box sx={{ml: 2}}>
              <Typography variant="h6" component="div">
                캠퍼스 선택
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        {itemList?.length ? <List>{itemList}</List> : <NoData height="140px" />}
      </Dialog>
    </>
  );
}
