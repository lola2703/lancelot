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
import License from "../pages/License";


class AdminLicense extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            redirectToBlog: false,
            editLicense: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.save = this.save.bind(this);
    }

    handleChange(value) {
        this.setState({text: value})
    }

    save() {
        var self = this;
        var q = require('querystring');
        axios.post(localStorage.getItem('API_URL') + '/admin/license/new', q.stringify({
            'token': sessionStorage.getItem('loginToken'),
            'title': document.getElementById('title').value,
            'text': this.state.text,
            'lang': document.getElementById('lang').value,
            'editId': (this.props.props.match.params.id) ? this.props.props.match.params.id : 0
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

    componentWillMount() {

        if (this.props.edit) {
            var id = this.props.props.match.params.id;
            var self = this;
            axios.get(localStorage.getItem('API_URL') + '/license/getById/' + id)
                .then(function(response) {
                    self.setState({
                        editLicense: response.data[0],
                        text: response.data[0].text
                    })
                })
                .catch(function (err) {
                    console.log(err);
                    alert('Item not found.');
                })
        }

    }

    render() {
        if (this.props.delete) {
            if (this.state.redirectToBlog) {
                return (
                    <Redirect to="/license"/>
                )
            } else {
                var self = this;
                var q = require('querystring');
                axios.post(localStorage.getItem('API_URL') + '/admin/license/delete', q.stringify({
                    'token': sessionStorage.getItem('loginToken'),
                    'id': this.props.props.match.params.id
                }))
                    .then(function (response) {
                        self.setState({
                            redirectToBlog: true
                        })
                    })

                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Please wait...
                            </CardTitle>
                        </CardHeader>
                    </Card>
                )
            }
        } else if (this.props.edit && this.state.redirectToBlog == false) {
            if (this.state.editLicense.length == 0){
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
                            <CardTitle><Input placeholder="Title...." type="text" id="title"
                                              defaultValue={this.state.editLicense.title}/></CardTitle>
                        </CardHeader>
                        <CardBody>
                            <ReactQuill value={this.state.text}
                                        onChange={this.handleChange}
                            />
                            <FormGroup>
                                <Label for="lang">{this.props.lang.lang}</Label>
                                <Input type="select" name="lang" key="lang" id="lang" defaultValue={this.state.editLicense.lang}>
                                    {this.props.lang.getAvailableLanguages().map((lang) => {
                                        return (<option value={lang}>{lang}</option>)
                                    })}
                                </Input>
                            </FormGroup>
                        </CardBody>
                        <CardFooter>
                            <Button color="success" onClick={this.save}>{this.props.lang.save}</Button>
                        </CardFooter>
                    </Card>)
            }
        } else if (this.state.redirectToBlog) {
            return (
                <Redirect to="/license"/>
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

export default AdminLicense;