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
    CardHeader,
    CardFooter,
    CardText,
    Table,
    CardBody,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from 'reactstrap';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import ReactTable from "react-table";
import FormInput from "../components/FormInput";


class Classmanagement extends React.Component {
    constructor(props) {
        super(props);

        var manageDataEmpty = new Array();
        manageDataEmpty['data'] = new Array();
        manageDataEmpty['info'] = new Array();

        this.state = {
            data: [],
            manageOpen: false,
            manageData: manageDataEmpty,
            manageId: 0,
            loading: true,
            newStudentOpen: false,
            students: [],
            manageBooksModal: false,
            books: []
        }

        this.manage = this.manage.bind(this);
        this.new = this.new.bind(this);
        this.loadData = this.loadData.bind(this);
        this.toggleNewStudent = this.toggleNewStudent.bind(this);
        this.manageBooks = this.manageBooks.bind(this);
    }

    componentWillMount() {
        this.loadData();
    }

    loadData() {
        var self = this;
        var q = require('querystring');

        axios.post(localStorage.getItem('API_URL') + '/teacher/groups',
            q.stringify({
                token: sessionStorage.getItem('loginToken')
            }))
            .then(function (response) {
                var tmp = [];
                response.data.map((d) => {
                    tmp.push(d);
                });
                self.setState({
                    data: tmp,
                    loading: false
                });
            });
    }

    manage(iId) {

        var manageDataEmpty = new Array();
        manageDataEmpty['data'] = new Array();
        manageDataEmpty['info'] = new Array();

        if (iId == 0) {
            this.setState({
                manageId: 0,
                manageData: manageDataEmpty,
                manageOpen: false
            });
            return true;
        }

        this.setState({
            manageId: iId
        });

        var self = this;
        var q = require('querystring');

        axios.post(localStorage.getItem('API_URL') + '/teacher/groups/detail', q.stringify({
            token: sessionStorage.getItem('loginToken'),
            group: iId
        }))
            .then(function (response) {
                self.setState({
                    manageData: response.data,
                    manageOpen: true
                });
            })


    }

    new() {
        var sName = prompt(this.props.lang.newClassPromp, '');

        if (sName == null || sName.length == 0) {
            return;
        }

        var self = this;
        var q = require('querystring');

        axios.post(localStorage.getItem('API_URL') + '/teacher/groups/new', q.stringify({
            token: sessionStorage.getItem('loginToken'),
            name: sName
        }))
            .then(function (response) {
                self.loadData();
                return true;
            });

    }

    newStudent() {
        var iStudent = document.getElementById('student').value;
        var self = this;
        var q = require('querystring');

        axios.post(localStorage.getItem('API_URL') + '/teacher/groups/studentToGroup', q.stringify({
            token: sessionStorage.getItem('loginToken'),
            student: iStudent,
            group: self.state.manageId
        }))
            .then(function (response) {
                self.loadData();
                self.toggleNewStudent();
                self.manage(self.state.manageId);
                return true;
            });
    }

    toggleNewStudent() {

        if (this.state.newStudentOpen == false) {
            var self = this;
            var q = require('querystring');
            axios.post(localStorage.getItem('API_URL') + '/teacher/groups/loadStudentsNotInGroup', q.stringify({
                token: sessionStorage.getItem('loginToken'),
                group: this.state.manageId
            }))
                .then(function (response) {
                    self.setState({
                        newStudentOpen: true,
                        students: response.data.map((student) => <option key={student.id}
                                                                       value={student.id}>{student.name}</option>)
                    });
                })
                .catch(function (error) {
                    alert(error);
                });
        } else {
            this.setState({
                newStudentOpen: !this.state.newStudentOpen
            });
        }
    }

    deleteStudentFromGroup(iStudent) {
        var iGroup = this.state.manageId;

        var self = this;
        var q = require('querystring');

        axios.post(localStorage.getItem('API_URL') + '/teacher/groups/deleteStudentFromGroup', q.stringify({
            token: sessionStorage.getItem('loginToken'),
            student: iStudent,
            group: iGroup
        }))
            .then(function (response) {
                self.loadData();
                self.manage(self.state.manageId);
                return true;
            });
    }

    manageBooks(iGroup) {
        if (iGroup == 0) {
            this.setState({
                manageBooksModal: false,
                books: []
            });
            return;
        }

        //Bücher laden
        var self = this;
        var q = require('querystring');
        axios.post(localStorage.getItem('API_URL') + '/group/getBooksByGroup', q.stringify({
            token: sessionStorage.getItem('loginToken'),
            group_id : iGroup
        }))
            .then (function(res) {
                self.setState({
                    books: res.data,
                    manageBooksModal: true
                })
            })
            .catch(function(err) {
                alert(err);
            })
    }

    deleteBookFromGroup(iBook, iGroup) {

        var self = this;
        var q = require('querystring');
        axios.post(localStorage.getItem('API_URL') + '/group/deleteBook', q.stringify({
            token: sessionStorage.getItem('loginToken'),
            group_id : iGroup,
            book_id: iBook
        }))
            .then (function(res) {
                self.manageBooks(0);
                self.manageBooks(iGroup);
            })
            .catch(function(err) {
                alert(err);
            })
    }


    render() {

        var columns = [{
            Header: 'Klasse',
            accessor: 'class'
        }, {
            Header: 'count students',
            accessor: 'cnt',
        }, {
            id: 'options',
            Header: 'Options',
            accessor: d => <div>
                <Button color={"green"}
                        onClick={() => this.manage(d.id)}>{this.props.lang.manage}</Button>
                &nbsp;
                <Button color={"primary"}
                        onClick={() => this.manageBooks(d.id)}>{this.props.lang.books}</Button>
                &nbsp;
                <Button color="red" onClick={() => this.delete(d.id)}>{this.props.lang.delete}</Button>
            </div>
        }];


        var studentCols = [{
            Header: 'Name',
            id: 'name',
            accessor: d => <div>{d.firstname} {d.lastname} ({d.username})</div>
        }, {
            Header: this.props.lang.gebdat,
            accessor: 'gebdat',
        }, {
            id: 'options',
            Header: 'Options',
            accessor: d => <div>
                <Button color="red" onClick={() => this.deleteStudentFromGroup(d.id)}>{this.props.lang.delete}</Button>
            </div>
        }];

        var bookCols = [{
            Header: 'Name',
            id: 'name',
            accessor: d => <div>{d.title}</div>
        }, {
            id: 'options',
            Header: 'Options',
            accessor: d => <div>
                <Button color="red" onClick={() => this.deleteBookFromGroup(d.book_id, d.group_id)}>{this.props.lang.delete}</Button>
            </div>
        }];

        return (
            <div>

                <Card>
                    <CardHeader>
                        <h2>{this.props.lang.classmanagement}</h2>
                    </CardHeader>
                    <CardBody>
                        <ReactTable
                            data={this.state.data}
                            columns={columns}
                            filterable={true}
                            showPagination={true}
                            defaultPageSize={10}
                            loading={this.state.loading}
                        />
                    </CardBody>
                    <CardFooter>
                        <Button color="green" onClick={this.new}>New</Button>
                    </CardFooter>
                </Card>

                <Modal size="lg" isOpen={this.state.manageOpen} toggle={() => this.manage(0)}>
                    <ModalHeader>
                        <h2>{this.props.lang.manage}</h2>
                    </ModalHeader>
                    <ModalBody>
                        <Card>
                            <CardHeader>
                                Name: {this.state.manageData.info.class}
                            </CardHeader>
                        </Card>

                        <ReactTable
                            data={this.state.manageData.data}
                            columns={studentCols}
                            filterable={true}
                            showPagination={true}
                            defaultPageSize={10}
                            loading={this.state.loading}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="green" onClick={this.toggleNewStudent}>{this.props.lang.newStudent}</Button>
                        <Button onClick={() => this.manage(0)} color="red">{this.props.lang.close}</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.newStudentOpen} toggle={() => this.toggleNewStudent()}>
                    <ModalHeader>
                        <h2>{this.props.lang.newStudent}</h2>
                    </ModalHeader>
                    <ModalBody>
                        <Label for="student">{this.props.lang.student}</Label>
                        <Input type="select" name="student" id="student">
                            {this.state.students}
                        </Input><br/>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => this.newStudent()} color="green">{this.props.lang.save}</Button>
                        <Button onClick={() => this.toggleNewStudent()} color="red">{this.props.lang.close}</Button>
                    </ModalFooter>
                </Modal>

                <Modal size="lg" isOpen={this.state.manageBooksModal} toggle={() => this.manageBooks(0)}>
                    <ModalHeader>
                        <h2>{this.props.lang.addToClassList}</h2>
                    </ModalHeader>
                    <ModalBody>
                        <ReactTable
                            data={this.state.books}
                            columns={bookCols}
                            filterable={false}
                            showPagination={true}
                            defaultPageSize={10}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => this.manageBooks(0)} color="red">{this.props.lang.close}</Button>
                    </ModalFooter>
                </Modal>

            </div>
        )
    }

}

export default Classmanagement;