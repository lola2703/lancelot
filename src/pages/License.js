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
    CardHeader,
    CardFooter,
    Row,
    CardTitle,
    CardSubtitle,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from 'reactstrap';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import FormInput from "../components/FormInput";

class License extends React.Component {


    username = "";
    firstname = "";
    lastname = "";
    city = "";
    country = "";
    email = "";
    phone = "";
    password = "";
    school = "";
    gebdat = "";
    role = "";
    class = "";
    cashType = "";

    constructor(props) {
        super(props);
        this.state = {
            entries: [],
            openModal: false,
            modalStep: 1,
            openPlan: 0,
            schools: [],
            modal: false,
            bDataOk: false
        }

        this.addSchool = this.addSchool.bind(this);
        this.loadSchools = this.loadSchools.bind(this);
        this.toggle = this.toggle.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.toggleModal = this.toggleModal.bind(this);

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

    toggleModal() {
        this.setState({
            modal: !this.state.modal
        });
    }

    componentWillMount() {
        this.loadSchools();
        var self = this;
        var lang = '/' + this.props.lang.getLanguage();
        if ((sessionStorage.getItem('role') == 'admin' || sessionStorage.getItem('role') == 'manager')) {
            lang = '';
        }
        axios.get(localStorage.getItem('API_URL') + '/license/get')
            .then(function (response) {
                var tmp = [];
                response.data.map((entry) => {
                    tmp.push(entry);
                });
                self.setState({
                    entries: tmp
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    toggle(iEntry) {
        this.setState({
            openModal: !this.state.openModal,
            openPlan: iEntry
        });
    }

    nextStep() {
        var self = this;
        var q = require('querystring');

        if (this.state.modalStep == 1) {
            //Check Data
            this.firstname = document.getElementById('firstname').value;
            this.lastname = document.getElementById('name').value;
            this.city = document.getElementById('city').value;
            this.school = document.getElementById('school').value;
            this.email = document.getElementById('email').value;
            this.gebdat = document.getElementById('gebdat').value;
            this.country = document.getElementById('country').value;
            this.role = document.getElementById('role').value;
            this.class = document.getElementById('class').value;

            if (this.firstname == "" || this.lastname == "" || this.city == "" || this.school == "" || this.email == "" || this.gebdat == "" || this.country == "" || this.class == "") {
                alert(this.props.lang.filloutalert);
            } else {
                axios.post(localStorage.getItem('API_URL') + '/user/new/checkmail', q.stringify({
                    email: this.email
                }))
                    .then(function (response) {
                        self.setState({
                            modalStep: 2
                        });
                    })
                    .catch(function (error) {
                        alert('Mail already used.');
                    });
            }
        }
        else if (this.state.modalStep == 2) {
                this.username = document.getElementById('username_new').value;
            //this.password = document.getElementById('password_new').value;
            this.cashType = document.getElementById('cashtype').value;

            if (this.username == "" || this.cashType == "") {
                alert(this.props.lang.filloutalert);

            } else {
                axios.post(localStorage.getItem('API_URL') + '/user/new/checkusername', q.stringify({
                    username: this.username
                }))
                    .then(function (response) {

                        self.setState({
                            bDataOk: true
                        });
                        var data = q.stringify({
                            username: self.username,
                            firstname: self.firstname,
                            lastname: self.lastname,
                            city: self.city,
                            school: self.school,
                            class_: self.class,
                            email: self.email,
                            gebdat: self.gebdat,
                            country: self.country,
                            cashtype: self.cashType,
                            role: self.role,
                            lang: self.props.lang.getLanguage(),
                            telnumber: self.phone

                        });

                        axios.post(localStorage.getItem('API_URL') + '/user/new', data)
                            .then(function (response) {
                                self.setState({
                                    modalStep: 3
                                });
                            })
                            .catch(function (error) {
                                alert('An error occured.');
                            });
                    })
                    .catch(function (error) {
                        alert('Username already used.');
                    });


            }
        }
    }


    render() {
        return (
            <div>

                <Row>
                    <Card>
                        <CardBody>
                            <div
                                dangerouslySetInnerHTML={{__html: localStorage.getItem('licenseOpener_' + this.props.lang.getLanguage())}}>

                            </div>
                        </CardBody>
                    </Card>
                </Row>

                {this.state.entries.map((entry) => {
                    return (



                        <Row>
                            <Col key={entry.id}><Card>
                                <CardHeader>

                                    <CardTitle>
                                        {entry.title}
                                    </CardTitle>


                                </CardHeader>
                                <CardBody>
                                    <div dangerouslySetInnerHTML={{__html: entry.text}}>

                                    </div>
                                </CardBody>
                                <CardFooter>
                                    <Button color="success"
                                            onClick={(e) => this.toggle(entry.id)}>{this.props.lang.kaufen}</Button>
                                    {(sessionStorage.getItem('role') == 'admin' || sessionStorage.getItem('role') == 'manager') && (
                                        <div>
                                            <br/>
                                            <Link to={"/admin/license/delete/" + entry.id}><Button color="danger">{this.props.lang.delete}</Button></Link>&nbsp;
                                            <Link to={"/admin/license/edit/" + entry.id}><Button color="green">{this.props.lang.edit}</Button></Link>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card></Col></Row>)
                })}


                <Modal toggle={this.toggle} isOpen={this.state.openModal}>
                    <ModalHeader toggle={this.toggle}>

                        {this.props.lang.enterData}
                    </ModalHeader>
                    {this.state.modalStep == 1 && (
                        <ModalBody>
                            <FormInput type="text" id="firstname" label={this.props.lang.Firstname}/>
                            <FormInput type="text" id="name" label={this.props.lang.Lastname}/>
                            <FormInput type="date" id="gebdat" label={this.props.lang.gebdat}/>
                            <FormInput type="text" id="country" label={this.props.lang.Land}/>
                            <FormInput type="email" id="email" label={this.props.lang.email}/>
                            <FormInput type="text" id="phone" label={this.props.lang.phone}/>
                            <FormInput type="text" id="city" label={this.props.lang.Stadt}/>
                            <FormGroup>
                                <Label for="role">{this.props.lang.registTypeQuestion}</Label>
                                <Input type="select" name="role" id="role">
                                    <option key="student" value="student">{this.props.lang.student}</option>
                                    <option key="teacher" value="teacher">{this.props.lang.teacher}</option>
                                </Input>
                            </FormGroup>
                                <FormGroup>
                                    <Label for="school">{this.props.lang.school}</Label>
                                    <Input type="select" name="school" id="school">
                                        {this.state.schools}
                                    </Input>
                                </FormGroup>
                                <Link to="#" onClick={this.toggleModal}>{this.props.lang.schoolNotFound}</Link> <br />
                            <FormInput type="text" id="class" label={this.props.lang.class}/>
                        </ModalBody>
                        )}

                        {this.state.modalStep == 2 && (
                            <ModalBody>
                                <FormInput type="text" id="username_new" label={this.props.lang.username} />
                                <FormGroup>
                                    <Label for="cashtype">{this.props.lang.cashType}</Label>
                                    <Input type="select" name="cashtype" id="cashtype">
                                        <option value="1">{this.props.lang.cashType1}</option>
                                        <option value="2">{this.props.lang.cashType2}</option>
                                        <option value="3">{this.props.lang.cashType3}</option>
                                    </Input>
                                </FormGroup>
                            </ModalBody>
                        )}

                        {this.state.modalStep == 3 && (
                            <ModalBody>
                                {this.props.lang.bookingConformation}
                            </ModalBody>
                        )}

                        {this.state.modalStep == 1 && (
                            <ModalFooter>
                                <Button color="primary" onClick={this.nextStep}>{this.props.lang.next}</Button>
                            </ModalFooter>
                        )}
                        {this.state.modalStep == 2 && (
                            <ModalFooter>
                                <Button color="primary" onClick={this.nextStep}>{this.props.lang.confStep}</Button>
                            </ModalFooter>
                        )}
                        {this.state.modalStep == 3 && (
                            <ModalFooter>
                                <Button color="primary" onClick={this.toggle}>{this.props.lang.close}</Button>
                            </ModalFooter>
                        )}
                        </Modal>


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

                    }

                    export default License;
