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
import {Box, Checkbox, ListItem, ListItemButton} from "@mui/material";
import NoData from "@common/NoData";
import {Check, CheckBox} from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import {getCampusUserByUserIdQuery} from "@recoils/campus/query";
import Loading from "components/Loading/Loading";
import Error from "components/Error/Error";
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

export default function HistoryCampusDialogMulti({
  open,
  setOpen,
  soonjang,
  selectedUsers,
  handleUser,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  soonjang: any;
  selectedUsers: User[];
  handleUser: any;
}) {
  const {isLoading, isError, data, error, refetch} = getCampusUserByUserIdQuery(soonjang.userid);
  const [swList, setSwList] = React.useState([]);
  const [selected, setSelected] = React.useState(selectedUsers || []);
  React.useEffect(() => {
    refetch();
    setSwList(data);
  }, [soonjang, data]);

  if (isLoading) return <Loading />;
  if (isError) {
    console.log("isError >>", isError, error);
    return <Error error={error} />;
  }
  const handleItem = () => {
    setOpen(false);
    // console.log("handle item : ", selected);
    handleUser(selected);
    setSelected([]);
  };
  const handleClose = () => {
    setSelected([]);
    setOpen(false);
  };
  const handleSelectedUser = (user: any) => {
    // setOpen(false);
    // setSelected([...selected, user]);
    const idx = selected?.findIndex((obj: any) => obj.userid == user?.userid);
    if (idx > -1) {
      setSelected([...selected.slice(0, idx), ...selected.slice(idx + 1, selected.length)]);
    } else {
      setSelected([...selected, user]);
    }
    // handleUser(user);
  };
  //FIXME: 시간 복잡도가 문제 때문에, set을 사용했습니다.
  // const selectedUserSet = new Set(selectedUsers?.map(user => user.userid));
  // const filteredUsers = users?.filter(user => !selectedUserSet.has(user.userid));
  // console.log("users - history dialogMulti :", soonjang, data);
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
            <IconButton edge="end" color="inherit" onClick={handleItem} aria-label="close">
              <CheckIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <CampusUserList campusUserList={swList} handleSelectedUser={handleSelectedUser} selected={selected} soonjang={soonjang} />
      </Dialog>
    </Box>
  );
}

function CampusUserList({campusUserList, handleSelectedUser, selected, soonjang}: any) {
  // console.log("campusUserList  : ", campusUserList);
  return (
    <List sx={{padding: 0}}>
      {campusUserList?.map(({users, campus}: any) => (
        <Box key={campus?.campusid}>
          <ListItem sx={{backgroundColor: "#ccc"}}>{campus.name}</ListItem>
          <UserItems users={users} handleSelectedUser={handleSelectedUser} selected={selected} soonjang={soonjang} />

          <Divider />
        </Box>
      ))}
    </List>
  );
}

function UserItems({soonjang, users, handleSelectedUser, selected}: any) {
  // console.log("seletedUsers : ", selected);
  return (
    <>
      {users.map((user: any) => {
        console.log("user >", user);
        return (
          <ListItemButton key={user?.userid} onClick={() => handleSelectedUser(user)} disabled={user?.userid == soonjang?.userid}>
            <Checkbox checked={selected?.find((seletedUser: any) => seletedUser?.userid == user?.userid) ? true : false}></Checkbox>
            <ListItemText primary={user?.nickname} />
          </ListItemButton>
        );
      })}
    </>
  );
}
