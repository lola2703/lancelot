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




class AdminFaq extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '', redirectToBlog: false, editFaq : [], title: '' } // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
        this.save = this.save.bind(this);
        //this.onDragEnd = this.onDragEnd.bind(this);
    }



    handleChange(value) {
        this.setState({ text: value })
    }

    save() {
        var self = this;
        var q = require('querystring');
        axios.post(localStorage.getItem('API_URL') + '/admin/faq/new', q.stringify({
            'token' : sessionStorage.getItem('loginToken'),
            'title' : document.getElementById('title').value,
            'text' : this.state.text,
            'lang' : document.getElementById('lang').value,
            'editId' : (this.props.edit) ? this.props.props.match.params.id : 0
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

    componentWillMount(){
        var self = this;
        if (this.props.edit) {
            axios.get(localStorage.getItem('API_URL') + '/faq/getById/' + this.props.props.match.params.id)
                .then(function (response) {
                    self.setState({
                        editFaq: response.data[0],
                        text: response.data[0].text,
                        title: response.data[0].title
                    })

                })
        }
    }

    render() {

        if (this.props.delete) {
            if (this.state.redirectToBlog) {
                return (
                    <Redirect to="/faq"/>
                )
            } else {
                var self = this;
                var q = require('querystring');
                axios.post(localStorage.getItem('API_URL') + '/admin/faq/delete', q.stringify({
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
                    <Redirect to="/faq"/>
                )
            } else {
                if (this.props.edit && this.state.editFaq.length == 0) {
                    return(
                        <Card>
                            <CardHeader>
                                Loading...
                            </CardHeader>
                        </Card>
                    )
                } else {
                    return (
                        <Card>
                            <CardHeader>
                                <Input type="text" id="title" defaultValue={this.state.title}/>
                            </CardHeader>
                            <CardBody>
                                <ReactQuill value={this.state.text}
                                            onChange={this.handleChange}
                                />
                                <FormGroup>
                                    <Label for="lang">{this.props.lang.lang}</Label>
                                    <select className="form-control" name="lang" key="lang" id="lang"
                                            defaultValue={(this.props.edit) ? this.state.editFaq.lang : 0}>
                                        {this.props.lang.getAvailableLanguages().map((lang) => {
                                            if (this.state.editFaq.lang == lang) {
                                                return (<option value={lang} selected="selected">{lang}</option>)
                                            } else {
                                                return (<option value={lang}>{lang}</option>)
                                            }
                                        })}
                                    </select>
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
}

export default AdminFaq;