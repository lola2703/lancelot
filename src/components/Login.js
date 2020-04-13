import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import {Alert, ModalHeader, Modal, Card, CardHeader,   CardBody, CardFooter, CardText, CardTitle, ModalFooter, ModalBody, Button} from 'reactstrap';
import FormInput from "./FormInput";


class LoginForm extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            showAlert: false,
            redirect: false,
            forgotModalOpen: false,
            forgotStep: 1
        }
        this.onLoginClick = this.onLoginClick.bind(this);
        this.sendForgotPassword = this.sendForgotPassword.bind(this);
        this.checkCodeAndSetNewPassword = this.checkCodeAndSetNewPassword.bind(this);
    }

    onLoginClick() {
        const querystring = require('querystring');
        var self = this;
        axios.post(localStorage.getItem('API_URL') + '/login', querystring.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }))
            .then(function (response) {

                sessionStorage.setItem('loginToken', response.data.token);
                sessionStorage.setItem('username', response.data.username);
                sessionStorage.setItem('role', response.data.role);
                sessionStorage.setItem('bLogin', true);
                self.setState({redirect: true});
            })
            .catch(function (error) {
                self.setState({showAlert: true});
            });

    }

    sendForgotPassword(sEmail) {
        var self = this;
        var q = require('querystring');

        if (sEmail !== "") {

            axios.post(localStorage.getItem('API_URL') + '/forgotPassword', q.stringify({
                email: sEmail,
                step: 1
            }))
                .then(function (result) {
                    self.setState({
                        forgotStep: 2
                    });
                })
                .catch(function (err) {
                    alert(self.props.lang.errorForgotPassword);
                });
        }
    }

    checkCodeAndSetNewPassword() {
        var pw1 = document.getElementById('password1').value;
        var pw2 = document.getElementById('password2').value;

        if (pw1 === "" || pw2 === "" || document.getElementById('mailcodeinput').value == "") {
            alert(this.props.lang.filloutalert);
            return;
        }

        if (pw1 != pw2) {
            alert('Password did not match!');
        } else {
            var code = document.getElementById('mailcodeinput').value;
            var self = this;
            var q = require('querystring');
            axios.post(localStorage.getItem('API_URL') + '/forgotPassword', q.stringify({
                mailcode: code,
                password: pw1,
                step: 2
            }))
                .then( function(result) {
                    self.setState({
                        forgotStep: 3
                    });
                })
                .catch(function (err) {
                    alert(self.props.lang.errorForgotPassword);
                });
        }
    }


    render() {

        if (this.state.redirect) {
            window.location.reload(true);
        }

        if (this.props.forgotpassword === true) {
            if (this.state.forgotStep == 1) {
            return (

                <Card>

                    <CardHeader>
                        <CardTitle>{this.props.lang.forgotPassword}</CardTitle>
                    </CardHeader>
                    <CardBody>

                    <FormInput type="email" id="emailForgot" label={this.props.lang.email} value="" />

                    </CardBody>
                    <CardFooter>
                    <Button color="green" onClick={() => this.sendForgotPassword(document.getElementById('emailForgot').value)}>{this.props.lang.save}</Button>
                    </CardFooter>
                </Card>

            ) }
            if (this.state.forgotStep == 2) {
               return (
                   <Card>
                       <CardHeader>
                           <CardTitle>{this.props.lang.forgotPassword}</CardTitle>
                       </CardHeader>
                       <CardBody>
                           <Alert color="info">
                               You recieved an email with your personal conformation code.
                           </Alert>
                           <FormInput type="text" id="mailcodeinput" label="Code" value="" /> <br />
                           <FormInput type="password" id="password1" label="New Password" value="" />
                           <FormInput type="password" id="password2" label="Repeat Password" value="" />
                       </CardBody>
                       <CardFooter>
                           <Button color="green" onClick={this.checkCodeAndSetNewPassword}>{this.props.lang.save}</Button>

                       </CardFooter>
                   </Card>
               )
            }

            if (this.state.forgotStep == 3) {
                return (
                    <Card>
                        <CardHeader>
                            Your password has been changed!
                        </CardHeader>
                    </Card>
                )
            }
        }


        if (this.props.card == false) {


            return (

                <div>
                    <Alert color="danger" isOpen={this.state.showAlert}>
                        {this.props.lang.loginFailed}
                    </Alert>
                    <div className="form-group">
                        <label className="form-label">{this.props.lang.username}</label>
                        <input type="text" className="form-control" id="username"
                               aria-describedby="" placeholder={this.props.lang.username}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label">
                            {this.props.lang.password}
                            <Link to="/forgot-password"
                                  className="float-right small">{this.props.lang.forgotPassword}</Link>
                        </label>
                        <input type="password" className="form-control" id="password"
                               placeholder={this.props.lang.password}/>
                    </div>
                    <div className="form-footer">
                        <button type="submit" onClick={this.onLoginClick}
                                className="btn btn-primary btn-block">{this.props.lang.login}</button>
                    </div>
                </div>

            );

        } else {
            return (

                <div>

                <div className="card" id="loginForm">
                    <div className="card-body p-6">
                        <div className="card-title">{this.props.lang.loginFormTitle}</div>


                        <Alert color="danger" isOpen={this.state.showAlert}>
                            {this.props.lang.loginFailed}
                        </Alert>
                        <div className="form-group">
                            <label className="form-label">{this.props.lang.username}</label>
                            <input type="text" className="form-control" id="username"
                                   aria-describedby="" placeholder={this.props.lang.username}/>
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                {this.props.lang.password}

                                <Link to="/forgot-password"

                                      className="float-right small">{this.props.lang.forgotPassword}</Link>
                            </label>
                            <input type="password" className="form-control" id="password"
                                   placeholder={this.props.lang.password}/>
                        </div>
                        <div className="form-footer">
                            <button type="submit" onClick={this.onLoginClick}
                                    className="btn btn-primary btn-block">{this.props.lang.login}</button>
                        </div>
                    </div>
                </div>





                </div>

            );
        }
    }
}

export default LoginForm;