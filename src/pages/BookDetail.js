import React from 'react';
import axios from 'axios';
import BookForm from "../components/BookForm";
import FormInput from "../components/FormInput";
import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Button,
    Alert,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import {Redirect} from 'react-router-dom';
import PlayQuiz from "../components/PlayQuiz";


class BookDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            book: [],
            id: this.props.props.match.params.id,
            error: false,
            requestOpen: false,
            quizOpen: false,
            deleteok: false,
            btnRequestColor: 'danger',
            bookToGroupModalOpen: false,
            groups: []
        }
        this.loadBook = this.loadBook.bind(this);
        this.save = this.save.bind(this);
        this.requestToggle = this.requestToggle.bind(this);
        this.delete = this.delete.bind(this);
        this.requestSend = this.requestSend.bind(this);
        this.startQuiz = this.startQuiz.bind(this);
        this.bookToGroup = this.bookToGroup.bind(this);
        this.closeAssignModal = this.closeAssignModal.bind(this);
    }

    closeAssignModal() {
        this.setState({
            bookToGroupModalOpen: false
        })
    }

    bookToGroup() {

        var self = this;
        let q = require('querystring');
        if (!this.state.bookToGroupModalOpen) {
            axios.post(localStorage.getItem('API_URL') + '/teacher/groups', q.stringify({
                token: sessionStorage.getItem('loginToken')
            }))
                .then(function (res) {
                    self.setState({
                        groups: res.data,
                        bookToGroupModalOpen: true
                    })
                });


        } else {
            axios.post(localStorage.getItem('API_URL') + '/group/addBook', q.stringify({
                token: sessionStorage.getItem('loginToken'),
                book_id: self.state.id,
                group_id: document.getElementById('group').value
            }))
                .then(function (res) {
                    self.setState({
                        bookToGroupModalOpen: false
                    });
                });

        }
    }

    startQuiz() {
        this.setState({
            quizOpen: !this.state.quizOpen
        });
    }

    loadBook() {
        var self = this;
        axios.get(localStorage.getItem('API_URL') + '/book/' + self.props.props.match.params.id)
            .then(function (response) {

                if (response.data === null) {
                    self.setState({
                        error: true
                    });
                } else {
                    self.setState({
                        book: response.data,
                        id: self.props.props.match.params.id
                    });

                    if (self.props.edit) {
                        document.getElementById('title').value = response.data.title;
                        document.getElementById('author').value = response.data.author;
                        document.getElementById('release-date').value = response.data.releaseDate;
                        document.getElementById('count-pages').value = response.data.page_count;
                        document.getElementById('isbn').value = response.data.ISBN;
                        document.getElementById('lang').value = response.data.lang;
                        document.getElementById('tags').value = response.data.tags;
                        document.getElementById('items').value = response.data.items;
                        document.getElementById('klappentext').value = response.data.desc;
                    }
                }
            })
            .catch(function (error) {
                alert(error);
                self.setState({

                    error: true
                });
            });
    }

    requestSend() {
        var self = this;
        var count = document.getElementById('quantity').value;

        if (count === '' || count == 0) {
            alert(this.props.lang.filloutalert);
            return;
        }

        var querystring = require('querystring');
        var data = querystring.stringify({
            token: sessionStorage.getItem('loginToken'),
            book_id: self.state.id,
            quantity: count
        });

        axios.post(localStorage.getItem('API_URL') + '/books/requestItem', data)
            .then(function (response) {
                self.requestToggle();
                self.setState({
                    btnRequestColor: 'success'
                });
            });
    }

    componentDidMount() {
        this.loadBook();
    }

    save() {
        var self = this;
        var title = document.getElementById('title').value;
        var author = document.getElementById('author').value;
        var isbn = document.getElementById('isbn').value;
        var releasedate = document.getElementById('release-date').value;
        var countpages = document.getElementById('count-pages').value;
        var tags = document.getElementById('tags').value;
        var minclass = document.getElementById('class').value;
        var lang = document.getElementById('lang').value;
        var items = document.getElementById('items').value;
        var id = this.state.id;
        var desc = document.getElementById('klappentext').value;

        if (title == '' || author == '' || isbn == '' || releasedate == '' || countpages == '' || tags == '' || items == 0) {
            alert(this.props.lang.filloutalert);
        } else {
            const querystring = require('querystring');
            const config = {
                // headers: { 'content-type': 'multipart/form-data' }
            }

            var data = new FormData();
            data.append('token', sessionStorage.getItem('loginToken'))
            data.append('title', title);
            data.append('author', author);
            data.append('isbn', isbn);
            data.append('releasedate', releasedate);
            data.append('countpages', countpages);
            data.append('tags', tags);
            data.append('minclass', minclass);
            data.append('klappentext', desc);
            data.append('lang', lang);
            data.append('items', items);
            data.append('id', id);

            axios.post(localStorage.getItem('API_URL') + '/admin/books/update', data, config)
                .then(function (response) {
                    self.setState({
                        deleteok: true
                    });
                })
                .catch(function (error) {
                    alert(error);
                });
        }
    }

    delete() {
        if (window.confirm(this.props.lang.areyousure)) {
            var self = this;

            const querystring = require('querystring');

            var data = querystring.stringify({
                token: sessionStorage.getItem('loginToken'),
                book_id: this.state.id
            });

            axios.post(localStorage.getItem('API_URL') + '/admin/books/delete', data)
                .then(function (response) {
                    self.setState({
                        deleteok: true
                    });
                })
                .catch(function (error) {
                    alert(error);
                })
        }
    }

    requestToggle() {
        if (this.state.btnRequestColor != 'success') {
            this.setState({
                requestOpen: !this.state.requestOpen,
            });
        }
    }

    render() {


        if (this.state.deleteok) {
            return (
                <Redirect to="/admin/books"/>
            );
        } else if (this.state.error) {
            return (
                <Alert color="danger">{this.props.lang.errorTitle}</Alert>
            );
        } else {
            if (this.props.edit) {
                return (
                    <Card>
                        <CardHeader>
                            <img src={localStorage.getItem('API_URL') + '/upload_files/' + this.state.book.cover}
                                 height="60"/>
                            <h1>&nbsp;{this.state.book.title}</h1>
                        </CardHeader>
                        <CardBody>
                            <BookForm cover={false} lang={this.props.lang}/>
                        </CardBody>
                        <CardFooter>
                            <Button color="danger" onClick={this.delete}>{this.props.lang.delete}</Button>
                            &nbsp;&nbsp;
                            <Button color="success" onClick={this.save}>{this.props.lang.save}</Button>
                        </CardFooter>
                    </Card>
                );
            } else {
                return (
                    <div>
                        <Card>
                            <CardHeader>
                                <h1>&nbsp;{this.state.book.title}</h1>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="2">
                                        <center><img
                                            src={localStorage.getItem('API_URL') + '/upload_files/' + this.state.book.cover}
                                            height="200"/></center>
                                    </Col>
                                    <Col md="4">
                                        <Row>
                                            <Col md="6"><b>{this.props.lang.author}</b></Col>
                                            <Col md="6">{this.state.book.author}</Col>
                                        </Row>
                                        <Row>
                                            <Col md="6"><b>{this.props.lang.pagescnt}</b></Col>
                                            <Col md="6">{this.state.book.page_count}</Col>
                                        </Row>
                                        <Row>
                                            <Col md="6"><b>{this.props.lang.isbn}</b></Col>
                                            <Col md="6">{this.state.book.ISBN}</Col>
                                        </Row>
                                        <Row>
                                            <Col md="6"><b>{this.props.lang.releasedate}</b></Col>
                                            <Col md="6">{this.state.book.releaseDate}</Col>
                                        </Row>
                                        <Row>
                                            <Col md="6"><b>{this.props.lang.classrecom}</b></Col>
                                            <Col md="6">{this.state.book.min_class_txt}</Col>
                                        </Row>
                                        <Row>
                                            <Col md="6"><b>{this.props.lang.items}</b></Col>
                                            <Col md="6">{this.state.book.items}</Col>
                                        </Row>
                                    </Col>
                                    <Col lg="4">
                                        <Row>
                                            {this.state.book.desc}
                                        </Row>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>

                                {(sessionStorage.getItem('role') == 'student' || (sessionStorage.getItem('role') == 'admin' || sessionStorage.getItem('role') == 'manager')) && (
                                    <div><Button color="danger"
                                                 onClick={this.startQuiz}>{this.props.lang.startQuiz}</Button></div>
                                )}
                                {(sessionStorage.getItem('role') == 'teacher') && (
                                    <div>
                                        <Button color="danger"
                                                onClick={this.bookToGroup}>{this.props.lang.addToClassList}</Button>
                                        &nbsp;&nbsp;
                                        <Button color={this.state.btnRequestColor}
                                                onClick={this.requestToggle}>{this.props.lang.request}</Button>
                                    </div>
                                )}
                            </CardFooter>
                        </Card>


                        <Modal isOpen={this.state.requestOpen}>
                            <ModalHeader toggle={this.requestToggle}>
                                <h1>{this.props.lang.request}</h1>
                            </ModalHeader>
                            <ModalBody>
                                <FormInput type="number" label={this.props.lang.items} id="quantity" key="quantity"/>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="success" onClick={this.requestSend}>{this.props.lang.request}</Button>
                            </ModalFooter>
                        </Modal>

                        <Modal isOpen={this.state.quizOpen}>
                            <ModalBody>
                                <PlayQuiz book_id={this.state.id} lang={this.props.lang}/>
                            </ModalBody>
                        </Modal>

                        <Modal isOpen={this.state.bookToGroupModalOpen}>
                            <ModalHeader>
                                <h1>{this.props.lang.addToClassList}</h1>
                            </ModalHeader>
                            <ModalBody>
                                <select className="form-control" name="group" key="group" id="group">
                                    {this.state.groups.map((group) => {
                                        return (<option value={group.id}>{group.class}</option>)
                                    })}
                                </select>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="green" onClick={this.bookToGroup}>{this.props.lang.save}</Button>
                                <Button color="red" onClick={this.closeAssignModal}>{this.props.lang.close}</Button>
                            </ModalFooter>
                        </Modal>

                    </div>


                );
            }
        }
    }

}

export default BookDetail;