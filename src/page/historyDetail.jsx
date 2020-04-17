import React from "react";
import { Grid, Container, Button } from "@material-ui/core";
import { NavLink } from "react-router-dom";

import DetailCard from "./components/card";
// import { makeStyles } from '@material-ui/core/styles';
import { data } from './components/data'
// const useStyles = makeStyles(theme => ({
//   root: {
//     flexGrow: 1
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: "center",
//     color: theme.palette.text.secondary
//   }
// }));
const CardGrid = () => {
  //   const classes = useStyles();
  return (
    <Container style={{ marginTop: '40px' }}>
      <NavLink to="/topics" style={{ textDecoration: 'none' }}>
        <Button style={{marginBottom:'20px',background:'#92d050',color:'black'}}  variant='contained' size="small" color="primary">
          Back
    </Button>
      </NavLink>
      <Grid container spacing={4}>
        {data.map((obj, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <DetailCard key={obj.id} name={obj} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CardGrid;
