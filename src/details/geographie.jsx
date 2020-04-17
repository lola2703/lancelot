import React from "react";
import {
  createMuiTheme,
  MuiThemeProvider,
  Typography,
  responsiveFontSizes,
  Container,
  Box
} from "@material-ui/core";
import Imgag1 from "../assets/images/geo.jpeg";
import useStyles from './style/pageStyle';
let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

const Geographie = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <MuiThemeProvider theme={theme}>
        <img src={Imgag1} alt="Geographie" className={classes.img}  align = "left" />
        <Container className={classes.box}>
          <Typography variant="h5"  gutterBottom>
            Biology OF Life
          </Typography>
          <Box my={2}>
            {[...new Array(120)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
              )
              .join("\n")}
          </Box>
        </Container>
      </MuiThemeProvider>
    </div>
  );
};

export default Geographie;
