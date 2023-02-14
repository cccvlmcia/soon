import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {useNavigate} from "react-router-dom";
import {Box, Button, Checkbox, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import Popover from "@mui/material/Popover";
import {api} from "@recoils/consonants";

const useStyles = makeStyles({
  root: {
    width: 390,
    height: 600,
    display: "flex",
    flexDirection: "column",
  },
  media: {
    height: 300,
  },
});

const avatar =
  "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20150403_67%2Fe2voo_14280514292377Sadp_JPEG%2Fkakako-03.jpg&type=a340";
type UserCard = {
  userid: number;
  nickname: string;
  pictureUrl: string;
  campus: string;
  major: string;
  sid: number;
  auth: [];
};
export default function UserCard({userid, nickname, pictureUrl = avatar, campus, major, sid, auth}: UserCard) {

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
  const authes = [
    {name: "순코디", id: "SOON"},
    {name: "관리자", id: "ADMIN"},
  ];
  //FIXME: 검토 필요
  const isAdmin = true || auth?.filter((authid: any) => authes?.filter(({id}) => id == authid)?.length || undefined)?.length > 0;
  return (
    <Card className={classes.root} onClick={() => navigate(`/soon/${userid}/card`)}>
      <CardMedia className={classes.media} image={pictureUrl} title={nickname} />
      <CardContent>
        <Box sx={{display: "flex"}}>
          <Box>
            <Typography variant="body1">ID: {userid}</Typography>
            <Typography variant="body1">이름: {nickname}</Typography>
            <Typography variant="body1">캠퍼스: {campus}</Typography>
            <Typography variant="body1">전공: {major}</Typography>
            <Typography variant="body1">학번: {sid}</Typography>
          </Box>
          {isAdmin && (
            <Box sx={{marginLeft: "auto"}}>
              <Button variant="outlined" onClick={openSubMenu}>
                권한
              </Button>
              <SubMenu id={userid} anchorEl={anchorEl} setAnchorEl={setAnchorEl} open={open} setOpen={setOpen} authes={authes} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
function SubMenu({id, anchorEl, setAnchorEl, open, setOpen, authes}: any) {
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
    /*
      보내는 사람이 auth가 있을 때, userid로
    */
    const {data} = await api.post(`/user/${id}/auth`, {authid});
    console.log("data  >>", data);
  };
  const items = authes?.map(({name, id}: any) => (
    <ListItem key={id} onClick={handleAuth} data-authid={id}>
      <ListItemIcon>
        <Checkbox edge="start" checked={true} />
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
