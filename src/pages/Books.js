import React from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Modal,
    ModalHeader,
    ModalFooter,
    ModalBody,
    CardTitle,
    Input,
    FormGroup,
    Label,
    InputGroup,
    InputGroupAddon
} from 'reactstrap';
import axios from 'axios';
import FormInput from './../components/FormInput';
import BookTable from "../components/BookTable";
import BookForm from "../components/BookForm";



class Books extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            books: [],
            toggle: false,
            isbnButtonColor: '',
            rating: 1,
            classes: [],
            lang: [],
            searchLang : this.props.lang.getLanguage()
        };
        this.toggle = this.toggle.bind(this);
        this.addBook = this.addBook.bind(this);


    }


    toggle() {
        this.setState({
            toggle: !this.state.toggle
        });
    }




    addBook() {
        var self = this;
        var title = document.getElementById('title').value;
        var author = document.getElementById('author').value;
        var isbn = document.getElementById('isbn').value;
        var releasedate = document.getElementById('release-date').value;
        var countpages = document.getElementById('count-pages').value;
        var tags = document.getElementById('tags').value;
        var minclass = document.getElementById('class').value;
        var lang = document.getElementById('lang').value;
        var file = document.getElementById('file').files[0];
        var klappentext = document.getElementById('klappentext').value;

        if (title == '' || author == '' || isbn == '' ) {
            alert(this.props.lang.filloutalert);
        } else {
            const querystring = require('querystring');
            const config = {
               // headers: { 'content-type': 'multipart/form-data' }
            }

            var data = new FormData();
            data.append('token', sessionStorage.getItem('loginToken'));
            data.append('file', file);
            data.append('title', title);
            data.append('author', author);
            data.append('isbn', isbn);
            data.append('releasedate', releasedate);
            data.append('countpages', countpages);
            data.append('tags', tags);
            data.append('minclass', minclass);
            data.append('lang', lang);
            data.append('klappentext', klappentext);

            axios.post(localStorage.getItem('API_URL')+'/admin/books/add', data, config)
                .then(function(response) {
                    self.toggle();
                    window.location.reload(true);
                })
                .catch(function(error) {
                    alert(error);
                });
        }
    }

    render() {
        return (
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>{this.props.lang.navBooks}</CardTitle>
                        {(sessionStorage.getItem('role') == 'admin' || sessionStorage.getItem('role') == 'manager') && this.props.admin == true && (
                            <CardTitle>&nbsp; &bull; &nbsp;<a className="cursorPointer" onClick={this.toggle}><u>{this.props.lang.addBook}</u></a></CardTitle>
                        )}
                    </CardHeader>
                    <CardBody>
                        <br />
                        <BookTable newBooks={this.props.newBooks} props={this.props.props} admin={this.props.admin} showLang={this.props.showLang} showCover={this.props.showCover} lang={this.props.lang} />
                    </CardBody>
                </Card>
                <Modal isOpen={this.state.toggle} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>{this.props.lang.addBook}</ModalHeader>
                    <ModalBody>

                    <BookForm lang={this.props.lang} cover={true}/>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.addBook}>{this.props.lang.save}</Button>
                        <Button color="secondary" onClick={this.toggle}>{this.props.lang.cancel}</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );

    }
}

export default Books;