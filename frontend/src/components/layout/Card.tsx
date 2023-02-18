import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {makeStyles} from "@material-ui/core/styles";
import {Box, Button, Checkbox, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import Popover from "@mui/material/Popover";
import {api} from "@recoils/constants";
import {authState} from "@recoils/auth/state";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {postUserAuth} from "@recoils/user/axios";

const useStyles = makeStyles({
  root: {
    width: 290,
    display: "flex",
    margin: "0 auto",
    flexDirection: "column",
    padding: "16px",
    border: "solid 1px #DDD",
    borderRadius: "4px",
  },
});

export function UserCard({userid, nickname, pictureUrl, campus, major, sid, isAdmin, authList}: any) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<Boolean>(false);
  const openSubMenu = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
    setAnchorEl(e.currentTarget);
  };
  return (
    <Box className={classes.root} onClick={() => navigate(`/soon/card/${userid}`)}>
      <Box>
        <Box sx={{display: "flex"}}>
          <AccountCircleIcon sx={{width: 80, height: 80, marginRight: "10px", opacity: "0.5"}} />
          {/* <Box
            component="img"
            sx={{
              display: "inline-block",
              width: 80,
              height: 80,
              borderRadius: "50%",
              marginRight: "10px",
            }}
            src={pictureUrl}
            alt={nickname}
          /> */}
          <Box sx={{">div": {display: "flex"}, div: {wordBreak: "break-all"}}}>
            <Box>
              <Box>
                {nickname}
                <Box component="span" sx={{fontSize: "0.8em", opacity: "0.5", marginLeft: "6px"}}>
                  {sid}학번
                </Box>
              </Box>
            </Box>
            <Box sx={{opacity: "0.5"}}>{major}</Box>
          </Box>
          {/* isAdmin(순코디/관리자) 일때만 조회*/}
          {isAdmin && (
            <Box sx={{marginLeft: "auto"}}>
              <Button variant="outlined" onClick={openSubMenu}>
                권한
              </Button>
              <SubMenu
                id={userid}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                open={open}
                setOpen={setOpen}
                authList={authList}
                campusid={campus?.campusid}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function SubMenu({id, anchorEl, setAnchorEl, open, setOpen, authList, campusid}: any) {
  const authes = useRecoilValue(authState);
  const [selected, setSelected] = useState(authList);
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };
  const handlePrevent = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleAuth = async (e: any) => {
    const {
      currentTarget: {
        dataset: {authid},
      },
    } = e;
    const {data} = await postUserAuth(id, {authid, campusid});
    if (data?.affected) {
      //deleted
      const idx = selected?.findIndex((item: any) => item?.authid == authid && item?.campusid == campusid);
      if (idx > -1) {
        setSelected([...selected.slice(0, idx), ...selected.slice(idx + 1, selected?.length)]);
      }
    } else {
      //added
      setSelected((selected: any) => [...selected, data]);
    }
  };
  const items = authes?.map(({name, id}: any) => (
    <ListItem key={id} onClick={handleAuth} data-authid={id}>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={selected?.find((item: {authid: string; campusid: string}) => item?.authid == id && item?.campusid == campusid) ? true : false}
        />
        <ListItemText id={id} primary={name} />
      </ListItemIcon>
    </ListItem>
  ));
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClick={handlePrevent}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}>
      <List sx={{bgcolor: "background.paper"}}>{items}</List>
    </Popover>
  );
}
