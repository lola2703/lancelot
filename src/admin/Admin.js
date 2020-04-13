import React from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Alert
} from 'reactstrap';
import {NavLink, Redirect} from "react-router-dom";
import {isMobile} from 'react-device-detect';
import axios from 'axios';





class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            denied: false
        };
    }

    componentWillMount() {
        var self = this;
        const querystring = require('querystring');

        var url = window.location.href;
        var aurl = url.split('/');
        var access = '';

        for(var i = 0; i < aurl.length; i++) {
            if (aurl[i] == 'admin') {
                access = aurl[i+1];
            }
        }

        if (aurl[aurl.length - 1] == 'admin') {
            access = '';
        }

        var postData = querystring.stringify(
            {
                token: sessionStorage.getItem('loginToken'),
                access: access,
            }
        );

        axios.post(localStorage.getItem('API_URL') + '/admin/access', postData)
            .then(function(response) {
                //nothing
            })
            .catch(function(error) {
                console.log(error);
                self.setState({
                    denied: true
                })
            })
    }
//

    render() {

        if (this.state.denied) {
            return(
                <Redirect to="/login" />
            )
        } else {
            return (
                <div></div>
            );
        }
    }
}

export default Admin;