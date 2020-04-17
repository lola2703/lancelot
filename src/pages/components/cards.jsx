import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    color:'darkgreen',
    borderRadius: 20,
    boxShadow: "0 3px 15px 2px rgba(146, 208, 80, 1)",
    borderColor:"rgba(146, 208, 80, 1)",
    border:'1px solid rgba(146, 208, 80, 1)',
    backgroundColor: 'white',
    padding: "2vw",
    margin: "6vh",
    "&:hover": {
      boxShadow: "0 3px 15px 2px rgba(66, 101, 30, 1)",
    }
  }
});

const CardsItem = props => {
  console.log(props);
  const classes = useStyles();

  return (
    <NavLink to={props.name.link} exact style={{textDecoration:'none'}}>
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {props.name.name}
          </Typography>
        </CardContent>
      </Card>
    </NavLink>
  );
};

export default CardsItem;
