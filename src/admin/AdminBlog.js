import React from 'react';
import axios from 'axios';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    FormGroup,
    Label,
    CardSubtitle,
    Row,
    Input,
    Col,
    Button
} from 'reactstrap';
import {Redirect} from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {PacmanLoader} from 'react-spinners';


class AdminBlog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '', redirectToBlog: false } // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
        this.save = this.save.bind(this);
    }

    handleChange(value) {
        this.setState({ text: value })
    }

    save() {
        var self = this;
        var q = require('querystring');
        axios.post(localStorage.getItem('API_URL') + '/admin/blog/new', q.stringify({
            'token' : sessionStorage.getItem('loginToken'),
            'title' : document.getElementById('title').value,
            'text' : this.state.text,
            'lang' : document.getElementById('lang').value
        }))
            .then(function (response) {
                self.setState({
                    redirectToBlog: true
                })
            })
            .catch(function (error) {
                alert(error);
            })
    }

    render() {

        if (this.props.delete) {
            if (this.state.redirectToBlog) {
                return (
                    <Redirect to="/blog"/>
                )
            } else {
                var self = this;
                var q = require('querystring');
                axios.post(localStorage.getItem('API_URL') + '/admin/blog/delete', q.stringify({
                    'token': sessionStorage.getItem('loginToken'),
                    'id': this.props.props.match.params.id
                }))
                    .then(function (response) {
                        self.setState({
                            redirectToBlog: true
                        })
                    })

                return(
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Please wait...
                            </CardTitle>
                        </CardHeader>
                    </Card>
                )
            }
        } else {

            if (this.state.redirectToBlog) {
                return (
                    <Redirect to="/blog"/>
                )
            } else {
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle><Input placeholder="Title...." type="text" id="title"/></CardTitle>
                        </CardHeader>
                        <CardBody>
                            <ReactQuill value={this.state.text}
                                        onChange={this.handleChange}
                            />
                            <FormGroup>
                                <Label for="lang">{this.props.lang.lang}</Label>
                                <Input type="select" name="lang" key="lang" id="lang">
                                    {this.props.lang.getAvailableLanguages().map((lang) => {
                                        return (<option>{lang}</option>)
                                    })}
                                </Input>
                            </FormGroup>
                        </CardBody>
                        <CardFooter>
                            <Button color="success" onClick={this.save}>{this.props.lang.save}</Button>
                        </CardFooter>
                    </Card>
                )
            }
        }
    }
}

export default AdminBlog;