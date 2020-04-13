import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import {Alert,  Card, CardHeader, Button, CardBody, CardFooter, CardTitle, CardText} from 'reactstrap';
import FormInput from "./FormInput";


class ChangePassword extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            showAlert: false,
            redirect: false
        }
        this.onLoginClick = this.onLoginClick.bind(this);
    }

    onLoginClick() {
        const querystring = require('querystring');
        var self = this;
        axios.post(localStorage.getItem('API_URL') + '/changepassword', querystring.stringify({
            pw1: document.getElementById('pw1').value,
            pw2: document.getElementById('pw2').value,
            token: sessionStorage.getItem('loginToken')
        }))
            .then(function (response) {
                self.setState({redirect: true});
            })
            .catch(function (error) {
                self.setState({showAlert: true});
            });

    }


    render() {

        if (this.state.redirect) {
            window.location.reload(true);
        }

        return (
            <Card>
                <CardHeader>
                    <h2>
                        {this.props.lang.changepw}
                    </h2>
                </CardHeader>
                <CardBody>

                    { (this.state.showAlert) && (
                        <Alert color="danger" isOpen={this.state.showAlert}>
                            {this.props.lang.alertpw}
                        </Alert>
                    )}

                    <FormInput
                        type="password"
                        id="pw1"
                        value=""
                        label={this.props.lang.newpw}
                    />
                    <FormInput
                        type="password"
                        id="pw2"
                        value=""
                        label={this.props.lang.newpw}
                    />
                </CardBody>
                <CardFooter>
                    <Button onClick={this.onLoginClick} color="green">{this.props.lang.save}</Button>
                </CardFooter>
            </Card>

        );


    }
}

export default ChangePassword;