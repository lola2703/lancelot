import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import LoginForm from "./../components/Login";
import { Link, Redirect } from "react-router-dom";
import history from "./History";
import {
  Row,
  CardTitle,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Modal,
  ModalBody,
  UncontrolledCarousel,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import { PulseLoader } from "react-spinners";
import messageIcon from "./../images/icon-1332772_640.png";
import bookIcon from "./../images/buecherregal.png";
import groupIcon from "./../images/klassen.png";
import statsIcon from "./../images/stats.png";
import ChangePassword from "../components/ChangePassword";
import logo from "../assets/images/logo.png";
import historyImage from "../assets/images/history.png";
import responseImage from "../assets/images/response.png";
import math from "../assets/images/math.png";

const items = [];

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cntMembers: 0,
      cntMembersToday: 0,
      cntBooks: 0,
      cntQuestions: 0,
      cntLibs: 0,
      cntSchools: 0,
      cntGroups: 0,
      loadData: true,
      points: 0,
      lastBook: [],
      changePw: false,
      email: "",
      modal: false,
      zugewiesenBooks: [],
      errors: {},
    };
    this.data = [
      {
        image: responseImage,
        firstHeading: "Plateforme educative en ligne",
        secondHeading: "Ordinateur, tablette, smartphone",
      },
      {
        image: historyImage,
        firstHeading: "Le plaisir d apprendre",
        secondHeading: "Tous les Theme du programme",
      },
      {
        image: logo,
        firstHeading: "Plateforme educative en ligne",
        secondHeading: "Systeme encourangeant de points",
      },
      {
        image: math,
        firstHeading: "Ideal for techer",
        secondHeading: "Creer des classes, suivre les notes",
      },
    ];
    this.imageStyle = {
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      width: "250px",
      height: "150px",
      borderRadius: "50px",
      border: "1px solid #92d050",
      padding: "5px",
    };
    this.headingStyle = {
      fontFamily:
        '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
      fontSize: "15px",
      fontWeight: 600,
      height: "22.5px",
      color: "rgb(73, 80, 87)",
    };

    //Bilder laden
    for (var i = 0; i < localStorage.getItem("cntImages"); i++) {
      items.push({
        src: localStorage.getItem(
          "img_" + this.props.lang.getLanguage() + "_" + i
        ),
        altText: "",
        caption: "",
        header: "",
      });
    }

    this.loadIndexData = this.loadIndexData.bind(this);
    this.renderLoggedIn = this.renderLoggedIn.bind(this);
    this.renderAdmin = this.renderAdmin.bind(this);
    this.renderTeacher = this.renderTeacher.bind(this);
    this.renderStudent = this.renderStudent.bind(this);
    this.toggleChangePw = this.toggleChangePw.bind(this);
  }

  componentWillMount() {
    this.loadIndexData();
  }

  toggleChangePw() {
    this.setState({
      changePw: !this.state.changePw,
    });
  }

  loadIndexData() {
    if (sessionStorage.getItem("role") == "student") {
      this.setState({
        laodData: true,
      });

      var self = this;
      var q = require("querystring");
      axios
        .post(
          localStorage.getItem("API_URL") + "/stat/get",
          q.stringify({
            token: sessionStorage.getItem("loginToken"),
          })
        )
        .then(function (response) {
          self.setState({
            points: response.data.points,
          });
        })
        .catch(function (err) {
          alert(err);
        });

      axios
        .post(
          localStorage.getItem("API_URL") + "/stat/lastread",
          q.stringify({
            token: sessionStorage.getItem("loginToken"),
          })
        )
        .then(function (response) {
          self.setState({
            lastBook: response.data,
          });
        })
        .catch(function (err) {
          alert(err);
        });
      axios
        .post(
          localStorage.getItem("API_URL") + "/stat/zugewiesenByUser",
          q.stringify({
            token: sessionStorage.getItem("loginToken"),
          })
        )
        .then(function (response) {
          self.setState({
            zugewiesenBooks: response.data,
          });
        })
        .catch(function (err) {
          alert(err);
        });
    }

    this.setState({
      loadData: false,
    });
  }

  renderLoggedIn() {
    if (this.state.loadData) {
      return (
        <Card>
          <CardBody>
            <center>
              Loading data...
              <br />
              <PulseLoader loading={true} color="#36D7B7" />
            </center>
          </CardBody>
        </Card>
      );
    } else {
      if (
        sessionStorage.getItem("role") == "admin" ||
        sessionStorage.getItem("role") == "manager"
      ) {
        return this.renderAdmin();
      } else if (sessionStorage.getItem("role") == "teacher") {
        return this.renderTeacher();
      } else if (sessionStorage.getItem("role") == "student") {
        return this.renderStudent();
      } else {
        return <div>ERROR</div>;
      }
    }
  }

  renderAdmin() {
    return (
      <div>
        <Row>
          <Card>
            <CardHeader>
              <CardTitle>
                Hello {sessionStorage.getItem("username")}, you're logged in as
                an administrator.
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Link to="/messages">Go to your inbox</Link>
              <br />
              <br />
              Use the menu below to manage your site!
            </CardBody>
            <CardFooter>
              <Button
                color="red"
                onClick={() => (window.location.href = "#/logout")}
              >
                {this.props.lang.logout}
              </Button>
              &nbsp;&nbsp;
              <Button color="green" onClick={() => this.toggleChangePw()}>
                {this.props.lang.changepw}
              </Button>
            </CardFooter>
          </Card>
        </Row>
        <Modal isOpen={this.state.changePw} toggle={this.toggleChangePw}>
          <ModalBody>
            <ChangePassword lang={this.props.lang} />
          </ModalBody>
        </Modal>
      </div>
    );
  }

  renderStudent() {
    return (
      <div>
        <Row>
          <Card>
            <CardBody>
              <h3>
                {this.props.lang.formatString(
                  this.props.lang.helloMessage,
                  sessionStorage.getItem("username")
                )}
              </h3>
              <CardTitle>{this.props.lang.niceToSeeYou}</CardTitle>
            </CardBody>
          </Card>
        </Row>
        <Row>
          <Col lg="4">
            <Card>
              <CardHeader>
                <center>
                  <h3>{this.props.lang.yourPoints}</h3>
                </center>
              </CardHeader>
              <CardBody>
                <center>
                  <h2>
                    <Link to="/stat/user">
                      {this.state.points} {this.props.lang.points}
                    </Link>
                  </h2>
                </center>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card>
              <CardHeader>
                <h3>{this.props.lang.leseprofil}</h3>
              </CardHeader>
              <CardBody>
                <center>
                  <Link to="/history">
                    <img src={bookIcon} height="100" />
                  </Link>
                </center>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card>
              <CardHeader>
                <h3>{this.props.lang.yourMessages}</h3>
              </CardHeader>
              <CardBody>
                <center>
                  <Link to="/messages">
                    <img src={messageIcon} height="100" />
                  </Link>
                </center>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <Card>
              <CardHeader>
                <h3>{this.props.lang.zugewieseneBuecherv}</h3>
              </CardHeader>
              <CardBody>
                {this.state.zugewiesenBooks.map(function (book) {
                  return (
                    <Link to={"/book/" + book.id}>
                      <img
                        src={
                          localStorage.getItem("API_URL") +
                          "/upload_files/" +
                          book.cover
                        }
                        height="100"
                      />
                    </Link>
                  );
                })}
              </CardBody>
            </Card>
          </Col>

          <Col lg="4">
            <Card>
              <CardHeader>
                <h3>{this.props.lang.lastBook}</h3>
              </CardHeader>
              <CardBody>
                <center>
                  {this.state.lastBook.id > 0 && (
                    <Link to={"/book/" + this.state.lastBook.id}>
                      <img
                        src={
                          localStorage.getItem("API_URL") +
                          "/upload_files/" +
                          this.state.lastBook.cover
                        }
                        height="100"
                      />
                      <h3>&nbsp;{this.state.lastBook.title}</h3>
                    </Link>
                  )}
                </center>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4"></Col>
        </Row>
        <Row>
          <Card>
            <CardBody>
              <Button
                color="red"
                onClick={() => (window.location.href = "#/logout")}
              >
                {this.props.lang.logout}
              </Button>
              &nbsp;&nbsp;
              <Button color="green" onClick={() => this.toggleChangePw()}>
                {this.props.lang.changepw}
              </Button>
            </CardBody>
          </Card>
        </Row>

        <Modal isOpen={this.state.changePw} toggle={this.toggleChangePw}>
          <ModalBody>
            <ChangePassword lang={this.props.lang} />
          </ModalBody>
        </Modal>
      </div>
    );
  }

  renderTeacher() {
    return (
      <div>
        <Row>
          <Card>
            <CardBody>
              <h3>
                {this.props.lang.formatString(
                  this.props.lang.helloMessage,
                  sessionStorage.getItem("username")
                )}
              </h3>
              <CardTitle>{this.props.lang.niceToSeeYou}</CardTitle>
            </CardBody>
          </Card>
        </Row>
        <Row>
          <Col lg="4">
            <Card>
              <CardHeader>
                <center>
                  <h3>{this.props.lang.stat}</h3>
                </center>
              </CardHeader>
              <CardBody>
                <center>
                  <h2>
                    <Link to="/stat/user">
                      <img src={statsIcon} height="100" />
                    </Link>
                  </h2>
                </center>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card>
              <CardHeader>
                <h3>{this.props.lang.classmanagement}</h3>
              </CardHeader>
              <CardBody>
                <center>
                  <Link to="/teacher/classes">
                    <img src={groupIcon} height="100" />
                  </Link>
                </center>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card>
              <CardHeader>
                <h3>{this.props.lang.yourMessages}</h3>
              </CardHeader>
              <CardBody>
                <center>
                  <Link to="/messages">
                    <img src={messageIcon} height="100" />
                  </Link>
                </center>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Card>
            <CardBody>
              <Button
                color="red"
                onClick={() => (window.location.href = "#/logout")}
              >
                {this.props.lang.logout}
              </Button>
              &nbsp;&nbsp;
              <Button color="green" onClick={() => this.toggleChangePw()}>
                {this.props.lang.changepw}
              </Button>
            </CardBody>
          </Card>
        </Row>

        <Modal isOpen={this.state.changePw} toggle={this.toggleChangePw}>
          <ModalBody>
            <ChangePassword lang={this.props.lang} />
          </ModalBody>
        </Modal>
      </div>
    );
  }
  handleChange = (event) =>
    this.setState({ email: event.target.value, errors: {} });
  handleValidate = () => {
    let emailIsValid = true;
    let errors = {};
    //Email
    if (!this.state.email || this.state.email.length === 0) {
      console.log(this.state.email.length, "enter");
      emailIsValid = false;
      errors["email"] = "Cannot be empty";
    }

    if (typeof this.state.email !== "undefined") {
      let lastAtPos = this.state.email.lastIndexOf("@");
      let lastDotPos = this.state.email.lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          this.state.email.indexOf("@@") == -1 &&
          lastDotPos > 2 &&
          this.state.email.length - lastDotPos > 2
        )
      ) {
        emailIsValid = false;
        errors["email"] = "Valid Email is required";
      }
    }
    this.setState({ errors: errors });
    return emailIsValid;
  };
  handleSubmit = () => {
    if (this.handleValidate(this.state.email)) {
      axios
        .post("https://stocktweets-server.herokuapp.com/tweets/send", {
          email: this.state.email,
        })
        .then((res) => console.log("res..", res))
        .catch((err) => console.log("err..", err));
      this.setState({ modal: true, email: "" });
    } else {
      console.log(this.state.errors);
    }
  };
  toggle = () => this.setState({ modal: false });

  render() {
    if (this.props.changelang) {
      this.props.lang.setLanguage(this.props.newlang);
      localStorage.setItem("LANGUAGE", this.props.lang.getLanguage());
      return <Redirect to="/" />;
    }

    if (this.props.logout) {
      sessionStorage.clear();
      return <Redirect to="/" />;
    }

    var bLogin = sessionStorage.getItem("bLogin");

    if (bLogin) {
      return this.renderLoggedIn();
    } else {
      return (
        <div>
          <Row>
            <Col lg="7">
              <UncontrolledCarousel items={items} />
              <br />
            </Col>
            <Col lg="4">
              <Card>
                <CardBody>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: localStorage.getItem(
                        "indexDesc_" + this.props.lang.getLanguage()
                      ),
                    }}
                  ></div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <div className=" dividerBookdriver footer bg-bookdriver "></div>
          {this.data.map((item) => (
            <Row
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
                margin: "auto",
              }}
            >
              <div
                style={{
                  marginTop: "50px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div>
                  <img src={item.image} alt="Paris" style={this.imageStyle} />
                </div>
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                  <h2 style={this.headingStyle}>{item.firstHeading}</h2>
                  <h2
                    style={{
                      fontFamily:
                        '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
                      fontSize: "15px",
                      fontWeight: 400,
                      height: "22.5px",
                      color: "rgb(73, 80, 87)",
                    }}
                  >
                    <i>{item.secondHeading}</i>
                  </h2>
                </div>
              </div>
            </Row>
          ))}
          <Row
            style={{
              margin: "50px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <InputGroup
              style={{
                width: "600px",
                border: "1px solid #92d050",
                borderRadius: "5px",
              }}
            >
              <Input
                onChange={(event) => this.handleChange(event)}
                required
                type="email"
              />
              <InputGroupAddon addonType="append">
                <Button
                  style={{ background: "#92d050", border: "none" }}
                  onClick={this.handleSubmit}
                >
                  <InputGroupText
                    style={{ background: "#92d050", border: "none" }}
                  >
                    NewsLetter
                  </InputGroupText>
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Row>
          <Row
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "-40px",
            }}
          >
            {this.state.errors && (
              <h5 style={{ color: "red" }}>{this.state.errors.email}</h5>
            )}
          </Row>
          <div>
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
              <ModalBody>Successfully Submitted!!</ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.toggle}>
                  Close
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        </div>
      );
    }
  }
}

export default Index;
