import React from "react";
import { Grid, Container } from "@material-ui/core";
import CardsItem from "./components/cards";
import { makeStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import {data} from './components/data'
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

const CardGrid = () => {
  const classes = useStyles();
  return (
    <Container style={{marginTop:'20px'}}>
    <Grid container >
      {data.map(obj => (
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <CardsItem key={obj.id} name={obj} />
          </Paper>
        </Grid>
      ))}
    </Grid>
    </Container>
  );
};

export default CardGrid;
