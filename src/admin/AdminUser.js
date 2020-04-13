import React from 'react';
import axios from 'axios';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    FormGroup,
    Input,
    Label,
    Card,
    CardBody,
    CardHeader,
    CardText,
    CardFooter
} from 'reactstrap';
import FormInput from "../components/FormInput";

class AdminUser extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            openUser: 0,
            showDetails: false,
            newUserModal: false
        };

        this.toggleUserStatus = this.toggleUserStatus.bind(this);
        this.loadList = this.loadList.bind(this);
        this.showDetails = this.showDetails.bind(this);
        this.newUserModal = this.newUserModal.bind(this);
        this.newAdminUser = this.newAdminUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    newAdminUser() {
        if (this.props.listType != "admin") {
            return;
        }

        var self = this;
        var q = require('querystring');

        if (document.getElementById('new_username').value == '' ||
            document.getElementById('new_password').value == '' ||
            document.getElementById('role').value == '' ||
            document.getElementById('new_email').value == '') {
            alert(this.props.lang.filloutalert);
            return;
        }

        axios.post(localStorage.getItem('API_URL') + '/admin/admins/new', q.stringify({
            username: document.getElementById('new_username').value,
            password: document.getElementById('new_password').value,
            role: document.getElementById('role').value,
            email: document.getElementById('new_email').value,
            token: sessionStorage.getItem('loginToken')
        }))
            .then(function (response) {
                self.setState({
                    newUserModal: false
                });
                self.loadList();
            })
            .catch(function (error) {
                alert(error);
            });

    }

    showDetails(iUser) {
        if (iUser == 0) {
            this.setState({
                showDetails: false
            });
            return;
        }
        this.setState({
            showDetails: true,
            openUser: []
        });


        var aUser = null;
        for (var i = 0; i < this.state.users.length; i++) {
            if (this.state.users[i].id == iUser) {
                aUser = this.state.users[i];
            }
        }

        this.setState({
            openUser: aUser
        });
    }

    loadList() {
        var self = this;
        var q = require('querystring');
        axios.post(localStorage.getItem('API_URL') + '/admin/user/list', q.stringify(
            {
                token: sessionStorage.getItem('loginToken'),
                type: this.props.listType
            }))
            .then(function (response) {
                var tmp = [];
                response.data.map((user) => {
                    user.paytypeText = '';
                    if (user.paytype == 1) {
                        user.paytypeText = self.props.lang.cashType1;
                    }
                    if (user.paytype == 2) {
                        user.paytypeText = self.props.lang.cashType2;
                    }
                    if (user.paytype == 3) {
                        user.paytypeText = self.props.lang.cashType3;
                    }
                    tmp.push(user);
                });



                self.setState({
                    users: tmp,
                    loading: false
                });
            })
            .catch(function (err) {
                alert(err);
            })
    }

    componentWillMount() {
        this.loadList();
    }

    toggleUserStatus(iUser, iCurrentStatus) {

        var self = this;
        var q = require('querystring');
        if (iCurrentStatus == 0) {
            axios.post(localStorage.getItem('API_URL') + '/admin/user/activate', q.stringify(
                {
                    token: sessionStorage.getItem('loginToken'),
                    user_id: iUser
                }))
                .then(function (response) {
                    if (response.data.error) {
                        alert("Error: " + response.data.error);
                    }
                    self.loadList();
                })
                .catch(function (err) {
                    alert(err);
                })
        } else {
            axios.post(localStorage.getItem('API_URL') + '/admin/user/block', q.stringify(
                {
                    token: sessionStorage.getItem('loginToken'),
                    user_id: iUser
                }))
                .then(function (response) {
                    self.loadList();
                })
                .catch(function (err) {
                    alert(err);
                })
        }

    }

    newUserModal() {
        this.setState({
            newUserModal: !this.state.newUserModal
        });
    }

    deleteUser(iUser) {
        if (window.confirm('Are you sure about this action?')) {
            var self = this;
            var q = require('querystring');
            axios.post(localStorage.getItem('API_URL') + '/admin/user/delete', q.stringify({
                token: sessionStorage.getItem('loginToken'),
                user_id: iUser
            }))
                .then(function (response) {
                    self.showDetails(0);
                    self.loadList();
                })
                .catch(function (err) {
                    alert(err);
                });
        }
    }

    render() {
        var columns = [];
        if (this.props.listType != 'admin') {
            columns = [{
                Header: 'Username',
                accessor: 'username'
            }, {
                Header: 'E-Mail',
                accessor: 'email',
            }, {
                Header: 'Role',
                accessor: 'role'
            }, {
                id: 'gebdat',
                Header: 'Gebdat',
                accessor: d => (d.role == 'student') ? d.gebdat : ''
            }, {
                id: 'school',
                Header: 'School',
                accessor: d => (d.role == 'student') ? d.name + ' (Class: ' + d.class + ')' : ((d.role == 'teacher') ? d.name : '')
            }, {
                id: 'options',
                Header: 'Options',
                accessor: d => <div>
                    <Button color={(d.status == 1) ? "red" : "green"}
                            onClick={() => this.toggleUserStatus(d.id, d.status)}>{(d.status == 1) ? this.props.lang.sperren : this.props.lang.freigeben}</Button>
                    &nbsp;
                    <Button color="primary" onClick={() => this.showDetails(d.id)}>{this.props.lang.details}</Button>
                </div>
            }];
        } else {
            columns = [{
                Header: 'Username',
                accessor: 'username'
            }, {
                Header: 'E-Mail',
                accessor: 'email',
            }, {
                Header: 'Role',
                accessor: 'role'
            }, {
                id: 'options',
                Header: 'Options',
                accessor: d => <div>
                    <Button color={(d.status == 1) ? "red" : "green"}
                            onClick={() => this.toggleUserStatus(d.id, d.status)}>{(d.status == 1) ? this.props.lang.sperren : this.props.lang.freigeben}</Button>
                    &nbsp;
                    <Button color="primary" onClick={() => this.showDetails(d.id)}>{this.props.lang.details}</Button>
                </div>
            }];
        }


        return (
            <div>
                {this.props.listType == 'admin' && (
                    <p>
                        <Button color="green" onClick={() => this.newUserModal()}>New User</Button>
                    </p>
                )}
                <ReactTable
                    data={this.state.users}
                    columns={columns}
                    filterable={true}
                    showPagination={true}
                    defaultPageSize={10}
                    loading={this.state.loading}
                />

                <Modal toggle={() => this.showDetails(0)} isOpen={this.state.showDetails}>
                    <ModalHeader toggle={() => this.showDetails(0)}>
                        <h2>{this.props.lang.details}</h2>
                    </ModalHeader>
                    <ModalBody>
                        {this.props.lang.client}: {this.state.openUser.client_id}<br/>
                        {this.props.lang.Firstname}: {this.state.openUser.firstname}<br/>
                        {this.props.lang.Lastname}: {this.state.openUser.lastname}<br />
                        {this.props.lang.cashType}: {this.state.openUser.paytypeText}<br />
                        <hr/>
                        {this.props.lang.username}: {this.state.openUser.username} <br/>
                        {this.props.lang.email}: {this.state.openUser.email}<br/>
                        {this.props.lang.gebdat}: {this.state.openUser.gebdat}<br/>
                        {this.props.lang.school}: {this.state.openUser.name}<br/>
                        {this.props.lang.class}: {this.state.openUser.class}<br/>
                        {this.props.lang.city}: {this.state.openUser.city}<br/>
                        {this.props.lang.Land}: {this.state.openUser.country}<br/>
                        {this.props.lang.phone}: {this.state.openUser.telnumber}<br/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="red" onClick={ () =>  this.deleteUser(this.state.openUser.id)}>{this.props.lang.delete}</Button>
                    </ModalFooter>
                </Modal>

                <Modal toggle={() => this.newUserModal()} isOpen={this.state.newUserModal}>
                    <ModalHeader toggle={() => this.newUserModal()}>
                        New User
                    </ModalHeader>
                    <ModalBody>
                        <FormInput type="text" id="new_username" label={this.props.lang.username}/>
                        <FormInput type="text" id="new_email" label={this.props.lang.email}/>
                        <FormInput type="password" id="new_password" label={this.props.lang.password}/>
                        <FormGroup>
                            <Label for="role">{this.props.lang.registTypeQuestion}</Label>
                            <Input type="select" id="role" id="role">
                                <option key="admin" value="admin">{this.props.lang.admin}</option>
                                <option key="teachWmanagerer" value="manager">{this.props.lang.manager}</option>
                            </Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.newAdminUser()}>{this.props.lang.save}</Button>
                    </ModalFooter>
                </Modal>

            </div>
        )
    }
}

export default AdminUser;
