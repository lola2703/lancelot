import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
      width: "100%",
      maxWidth: 500
    },
    media: {
      // height: 0,
      paddingTop: "56.25%" // 16:9
    },
    box: {
      margin: "14px auto",
      padding: "35px 40px 30px 40",
      color: "#444444",
      fontFamily: "Georgia",
      lineHeight: "18px",
      textAlign: "justify"
    },
    container: {
      width: "100%",
      margin: "0 auto",
      backgroundColor: "#FFF",
      // boxShadow: "0px 9px 13px 5px"
    },
    img: {
      width: "50%",
      padding: "20px 30px 10px 100px",
    }
  });
 
export default useStyles;