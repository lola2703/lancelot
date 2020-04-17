import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    // maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function DetailCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="https://picsum.photos/200"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.name.name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions style={{background:'#d6d6d6',justifyContent:'flex-end'}}>
          <NavLink to={props.name.link} style={{textDecoration:'none'}}>
        <Button variant='contained' size="small" color="primary" style={{background:'#92d050', color:'black'}}>
          Read more ...
        </Button>
        </NavLink>
      </CardActions>
    </Card>
  );
}
