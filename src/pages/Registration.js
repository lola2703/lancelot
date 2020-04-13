import React from 'react';
import {
    Alert,
    Button,
    ButtonGroup,
    FormGroup,
    Label,
    Input,
    Collapse,
    Card,
    CardBody,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from 'reactstrap';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';


class Registration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            alertFillout: false,
            regAlert: false,
            regAlertText: 'Dummy',
            showStudent: true,
            showTeacher: false,
            schools: [],
            classes: [],
            modal: false,
            redirect: false
        }
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.addSchool = this.addSchool.bind(this);
        this.loadSchools = this.loadSchools.bind(this);
        this.sendRegistration = this.sendRegistration.bind(this);
        sessionStorage.clear()
    }

    addSchool() {
        var self = this;
        const querystring = require('querystring');
        axios.post(localStorage.getItem('API_URL') + '/addSchool', querystring.stringify({school: document.getElementById('newSchool').value}))
            .then(function (response) {
                self.loadSchools();
            })
            .catch(function (error) {
                self.setState({showAlert: true});
            });
        self.toggleModal();
    }

    loadSchools() {
        var self = this;
        axios.get(localStorage.getItem('API_URL') + '/getSchools')
            .then(function (response) {
                self.setState({
                    schools: response.data.map((school) => <option key={school.id}
                                                                   value={school.id}>{school.name}</option>)
                });
            })
            .catch(function (error) {
                self.setState({showAlert: true});
            });
    }

    loadClasses() {
        var self = this;
        axios.get(localStorage.getItem('API_URL') + '/classes')
            .then(function (response) {
                self.setState({
                    classes: response.data.map((claas) => <option key={claas.id} value={claas.id}>{claas.name}</option>)
                });
            })
            .catch(function (error) {
                self.setState({showAlert: true});
            });
    }

    componentDidMount() {
        this.loadSchools();
        this.loadClasses();
    }

    onRadioBtnClick(rSelected) {
        this.setState({rSelected});
        if (rSelected === 1) {
            this.setState({
                showStudent: true,
                showTeacher: false
            });
        }
        if (rSelected === 2) {
            this.setState({
                showStudent: false,
                showTeacher: true
            });
        }
    }

    toggleModal() {
        this.setState({
            modal: !this.state.modal
        });
    }

    sendRegistration() {
        var self = this;
        var username = document.getElementById('newusername').value;
        var password = document.getElementById('newpassword').value;
        var role = (this.state.showStudent) ? 'student' : 'teacher';
        var school = document.getElementById('school').value;
        var classes = document.getElementById('class').value;
        var gebdat = document.getElementById('gebdat').value;
        var email = document.getElementById('email').value;

        if (username == '' || email == '' || password == '' || school == '' || (role == 'student' && (classes == '')) || gebdat == '') {
            self.setState({
                alertFillout: true
            });

        } else {

            const querystring = require('querystring');
            var postData = querystring.stringify(
                {
                    username: username,
                    password: password,
                    role: role,
                    school: school,
                    classes: classes,
                    gebdat: gebdat,
                    email: email,
                    lang: this.props.lang.getLanguage()
                }
            );

            axios.post(localStorage.getItem('API_URL') + '/registration', postData)
                .then(function (response) {
                    self.setState({redirect: true});
                })
                .catch(function (error) {
                    self.setState({
                        regAlert: true
                    });
                    console.log(error.data);
                });
        }
    }


    render() {


        var bLogin = sessionStorage.getItem('bLogin');

        if (this.state.redirect) {
            return (<Redirect to="/"/>);
        }

        if (bLogin) {
            return (<Alert color="danger"><b>{this.props.lang.errorTitle}</b><br/>{this.props.lang.alreadyLoggedIn}
            </Alert>);
        } else {
            return (
                <div id="registForm">
                    <div className="row row-cards row-deck">
                        <div className="col-lg-12">
                            <div className="card card-aside">
                                <div className="card-body">
                                    <h1>{this.props.lang.registration}</h1>
                                    <Alert color="danger" isOpen={this.state.showAlert}>
                                        {this.props.lang.regFailure}
                                    </Alert>
                                    <Alert color="danger" isOpen={this.state.alertFillout}>
                                        {this.props.lang.filloutalert}
                                    </Alert>
                                    <Alert color="danger" isOpen={this.state.regAlert}>
                                        {this.props.lang.regAlertText}
                                    </Alert>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row row-cards">
                        <div className="col-lg-6">
                            <div className="card" id="registFormLeft">
                                <div className="card-body p-6">
                                    <div className="form-group">
                                        <label className="form-label">{this.props.lang.username}</label>
                                        <input type="text" className="form-control" id="newusername"
                                               aria-describedby="" placeholder={this.props.lang.username}/>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">{this.props.lang.email}</label>
                                        <input type="email" className="form-control" id="email"
                                               aria-describedby="" placeholder={this.props.lang.email}/>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            {this.props.lang.password}
                                        </label>
                                        <input type="password" className="form-control" id="newpassword"
                                               placeholder={this.props.lang.password}/>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            {this.props.lang.registTypeQuestion}
                                        </label>
                                        <ButtonGroup>
                                            <Button color="primary" onClick={() => this.onRadioBtnClick(1)}
                                                    active={this.state.rSelected === 1}>{this.props.lang.student}</Button>
                                            <Button color="primary" onClick={() => this.onRadioBtnClick(2)}
                                                    active={this.state.rSelected === 2}>{this.props.lang.teacher}</Button>
                                        </ButtonGroup>
                                    </div>

                                </div>
                            </div>
                        </div>


                        <Col lg="6">
                            <Collapse isOpen={this.state.showStudent}>
                                <Card>
                                    <CardBody>
                                        <FormGroup>
                                            <Label for="school">{this.props.lang.school}</Label>
                                            <Input type="select" name="school" id="school">
                                                {this.state.schools}
                                            </Input>
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="school">{this.props.lang.class}</Label>
                                            <Input type="select" name="class" id="class">
                                                {this.state.classes}
                                            </Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="gebdat">{this.props.lang.gebdat}</Label>
                                            <Input type="date" name="gebdat" id="gebdat"/>
                                        </FormGroup>
                                    </CardBody>
                                </Card>
                            </Collapse>

                            <Collapse isOpen={this.state.showTeacher}>
                                <Card>
                                    <CardBody>
                                        <FormGroup>
                                            <Label for="school">{this.props.lang.school}</Label>
                                            <Input type="select" name="school" id="school">
                                                {this.state.schools}
                                            </Input><br/>
                                            <Button color="primary"
                                                    onClick={this.toggleModal}>{this.props.lang.schoolNotFound}</Button>
                                        </FormGroup>
                                    </CardBody>
                                </Card>
                            </Collapse>

                        </Col>
                    </div>


                    <div className="row row-cards row-deck">
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <FormGroup>
                                        <Button type="submit" color="warning" id="submit"
                                                onClick={this.sendRegistration}>{this.props.lang.registration}</Button>
                                    </FormGroup>
                                </CardBody>
                            </Card>
                        </Col>
                    </div>


                    <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggle}>{this.props.lang.addSchool}</ModalHeader>
                        <ModalBody>
                            <Input type="text" id="newSchool" name="newSchool"/>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.addSchool}>{this.props.lang.save}</Button>
                            <Button color="secondary" onClick={this.toggleModal}>{this.props.lang.cancel}</Button>
                        </ModalFooter>
                    </Modal>

                </div>

            );
        }
    };
}

export default Registration;
