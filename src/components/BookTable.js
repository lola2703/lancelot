import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Row, Col, Card, CardBody, CardImg, CardTitle, CardText, CardSubtitle, CardHeader} from 'reactstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from "axios/index";


class BookTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            books: [],
        }
        console.log(this.props.props);
        this.loadBooks = this.loadBooks.bind(this);
    }

    loadBooks() {
        var self = this;

        var searchLang = '';
        if (this.props.admin !== true) {
            //searchLang = '/' + this.props.lang.getLanguage();
        }



        if (this.props.newBooks) {
            //searchLang = '/' + this.props.lang.getLanguage() + '/new';
            searchLang = '/fr/new';
        }


        axios.get(localStorage.getItem('API_URL') + '/books' + searchLang)
            .then(function (response) {
                console.log(response.data)
                self.setState({
                    books: response.data
                });
            })
            .catch(function (error) {
                alert(error);
            });
        return this.state.books;
    };

    componentWillMount() {
        this.loadBooks();
    }

    render() {

        return (

            <Row>

                {this.state.books.map((book, index) => {


                    if ((typeof this.props.props.match.params.query == 'undefined') || ((typeof this.props.props.match.params.query != 'undefined') && book.title.toUpperCase().indexOf(this.props.props.match.params.query.toUpperCase()) > -1)) {

                        return (
                            <Col sm="3" key={book.id}>
                                <Card>
                                    <CardHeader className="bookdriverImageCard">
                                        <img
                                            src={localStorage.getItem('API_URL').replace('index.php', '') + '/thumb.php?x=200&y=200&bild=' + book.cover}/>
                                    </CardHeader>
                                    <CardBody>
                                        <CardTitle><Link to={"/book/"+book.id}>{book.title}</Link></CardTitle>
                                        <CardText>{book.author}</CardText>
                                        {((sessionStorage.getItem('role') == 'admin' || sessionStorage.getItem('role') == 'manager')) && (
                                            <CardText>
                                                <Link
                                                    to={"/admin/books/" + book.id + "/quiz"}>{this.props.lang.quizEdit}</Link>&nbsp;&bull;&nbsp;
                                                <Link
                                                    to={"/admin/books/" + book.id}>{this.props.lang.edit}</Link>
                                            </CardText>
                                        )}

                                    </CardBody>
                                </Card></Col>)
                    }
                })}
            </Row>
        );
    }

}

export default BookTable;