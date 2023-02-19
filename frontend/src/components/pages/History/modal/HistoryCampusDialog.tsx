import * as React from "react";
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
import NoData from "@common/NoData";

type User = {
  userid: string;
  nickname: string;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HistoryCampusDialog({
  open,
  setOpen,
  users,
  selectedUsers,
  handleUser,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  users: any[];
  selectedUsers: User[];
  handleUser: any;
}) {
  const handleClose = () => {
    setOpen(false);
  };
  const handleSelectedUser = (user: any) => {
    setOpen(false);
    handleUser(user);
  };
  //FIXME: 시간 복잡도가 문제 때문에, set을 사용했습니다.
  const selectedUserSet = new Set(selectedUsers?.map(user => user.userid));
  const filteredUsers = users?.filter(user => !selectedUserSet.has(user.userid));

  return (
    <Box>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{position: "relative"}}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
              유저 선택
            </Typography>
          </Toolbar>
        </AppBar>
        {filteredUsers?.length ? <UserList filteredUsers={filteredUsers} handleSelectedUser={handleSelectedUser} /> : <NoData height="140px" />}
      </Dialog>
    </Box>
    // <div>
    //   <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
    //     <AppBar sx={{position: "relative"}}>
    //       <Toolbar>
    //         <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
    //           <CloseIcon />
    //         </IconButton>
    //         <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
    //           캠퍼스 선택
    //         </Typography>
    //       </Toolbar>
    //     </AppBar>
    //     {/* <List>{itemList}</List> */}
    //   </Dialog>
    // </div>
  );
}

function UserList({filteredUsers, handleSelectedUser}: any) {
  return (
    <List>
      {filteredUsers?.map((user: any) => (
        <Box key={user.userid}>
          <ListItemButton onClick={() => handleSelectedUser(user)}>
            <ListItemText primary={user.nickname} />
          </ListItemButton>
          <Divider />
        </Box>
      ))}
    </List>
  );
}
