import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
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
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  console.log("campusSelected >", campusSelected);
  const handleClose = () => {
    setOpen(false);
  };
  const handleItem = (campus: any) => {
    setOpen(false);
    handleCampus(campus);
  };
  console.log("items >", items);
  const itemList = items?.map(item => (
    <Box key={item?.campusid}>
      <ListItemButton onClick={() => handleItem(item)}>
        {item?.campusid == campusSelected?.campusid && <CheckIcon />}
        <ListItemText primary={item?.name} secondary={item?.campusid} />
      </ListItemButton>
      <Divider />
    </Box>
  ));
  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{position: "relative"}}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
              캠퍼스 선택
            </Typography>
            {/* <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button> */}
          </Toolbar>
        </AppBar>
        <List>
          {itemList}
          {/* <ListItemButton onClick={handleItem}>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText primary="Default notification ringtone" secondary="Tethys" />
          </ListItemButton> */}
        </List>
      </Dialog>
    </div>
  );
}
