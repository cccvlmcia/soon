import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    width: 390,
    height: 600,
    display: 'flex',
    flexDirection: 'column',
  },
  media: {
    height: 300,
  },
});

export default function UserCard ({ userid, nickname, pictureUrl, campus, major, sid}: any) {
  const classes = useStyles();
  const navigate = useNavigate();
  return (//TODO:id path 바꾸기
    <Card className={classes.root}  onClick={() => navigate("/soon/11/card")}> 
      <CardMedia
        className={classes.media}
        image={pictureUrl}
        title={nickname}
      />
      <CardContent>
      <Typography variant="body1">
          ID: { userid }
        </Typography>
        <Typography variant="body1">
          이름: { nickname }
        </Typography>
        <Typography variant='body1'>
          캠퍼스: {campus}
        </Typography>
        <Typography variant='body1'>
          전공: {major}
        </Typography>
        <Typography variant='body1'>
          학번: {sid}
        </Typography>
      </CardContent>
    </Card>
  );
};

