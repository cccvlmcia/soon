import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {Box, Button, Checkbox, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import Popover from "@mui/material/Popover";
import {api} from "@recoils/constants";
import {authState} from "@recoils/auth/state";

const useStyles = makeStyles({
  root: {
    width: 290,
    height: 400,
    display: "flex",
    margin: "0 auto",
    flexDirection: "column",
  },
  media: {
    height: 300,
  },
});

const avatar =
  "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20150403_67%2Fe2voo_14280514292377Sadp_JPEG%2Fkakako-03.jpg&type=a340";
export function UserCard({userid, nickname, pictureUrl = avatar, campus, major, sid, isAdmin, authList}: any) {
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
    <Card className={classes.root} onClick={() => navigate(`/soon/card/${userid}`)}>
      <CardMedia className={classes.media} image={pictureUrl} title={nickname} />
      <CardContent>
        <Box sx={{display: "flex"}}>
          <Box>
            <Typography variant="body1">이름: {nickname}</Typography>
            <Typography variant="body1">ID: {userid}</Typography>
            {major && <Typography variant="body1">전공: {major}</Typography>}
            {sid && <Typography variant="body1">학번: {sid}</Typography>}
          </Box>
          {/* isAdmin(순코디/관리자) 일때만 조회*/}
          {isAdmin && (
            <Box sx={{marginLeft: "auto"}}>
              <Button variant="outlined" onClick={openSubMenu}>
                권한
              </Button>
              <SubMenu id={userid} anchorEl={anchorEl} setAnchorEl={setAnchorEl} open={open} setOpen={setOpen} authList={authList} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

function SubMenu({id, anchorEl, setAnchorEl, open, setOpen, authList}: any) {
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
    const {data} = await api.post(`/user/${id}/auth`, {authid});
    if (data?.affected) {
      //deleted
      const idx = selected?.findIndex((item: any) => item?.authid == authid);
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
        <Checkbox edge="start" checked={selected?.find(({authid}: {authid: string}) => authid == id) ? true : false} />
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
