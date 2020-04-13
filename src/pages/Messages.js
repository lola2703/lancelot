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
    Row,
    CardFooter,
    CardTitle,
    CardSubtitle,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Table
} from 'reactstrap';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';

class Messages extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            openMessage: false,
            openModal: false,
            login: true,
            redirect: false
        }

        this.toggle = this.toggle.bind(this);
    }

    componentWillMount() {
        var self = this;
        var q = require('querystring');

        axios.post(localStorage.getItem('API_URL') + '/messages', q.stringify({
            token: sessionStorage.getItem('loginToken')
        }))
            .then(function (response) {
                var tmp = [];
                response.data.map(message => {
                    if (message.subject != 'Internal Message System') {
                       tmp.push(message);
                    }
                });

                self.setState({
                    messages: tmp,
                    login: true
                });
            })
            .catch(function (error) {
                self.setState({
                    login: false
                });
            });
    }

    toggle() {
        this.setState({
            openModal: !this.state.openModal,
            openMessage: false,
            redirect: true
        });
    }

    render() {

        if (this.state.login == false) {
            return (
                <Redirect to="/login"/>
            )
        }

        if (this.state.redirect) {
            return (
                <Redirect to="/messages"/>
            )
        }


        if (this.props.props.match.params.id > 0 && this.state.openModal == false) {
            this.state.messages.map(message => {
                if (message.id == this.props.props.match.params.id) {
                    this.setState({
                        openMessage: message,
                        openModal: true
                    });
                }
            });


        }


        return (
            <div>
                <Table striped>
                    <thead>
                    <tr>
                        <th>
                            {this.props.lang.absender}
                        </th>
                        <th>
                            {this.props.lang.betreff}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.messages.map(message => {
                        return (
                            <tr>
                                <td>
                                    {this.props.lang.formatString(this.props.lang.msTimeFrom, message.username, message.date, message.time)}
                                </td>
                                <td>
                                    <Link to={"/messages/" + message.id}>{message.subject}</Link>
                                </td>

                            </tr>)
                    })}
                    </tbody>
                </Table>

                <Modal isOpen={this.state.openModal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>
                        <h2>{this.state.openMessage.subject}</h2>
                    </ModalHeader>
                    <ModalBody>
                        {this.state.openMessage.text}
                    </ModalBody>
                </Modal>

            </div>
        );
    }

}

export default Messages;