import React from 'react';
import {
    Card, CardHeader, CardBody, CardFooter, CardTitle, CardText, Alert, Button
} from 'reactstrap';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FormInput from "./FormInput";


class StaticSite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            siteKey: props.siteKey,
            siteText: '',
            siteTitle: '',
            currentAction: 'show'
        }

        this.loadSiteData = this.loadSiteData.bind(this);
        this.showSite = this.showSite.bind(this);
        this.editSite = this.editSite.bind(this);
        this.showError = this.showError.bind(this);
        this.saveEditSite = this.saveEditSite.bind(this);
        this.loadSiteData();
    }

    loadSiteData() {

        let self = this;
        axios.get(localStorage.getItem('API_URL') + '/static/' + this.state.siteKey + '_' + this.props.lang.getLanguage())
            .then(function (res) {
                //console.log(res);
                self.setState({
                    siteTitle: res.data.siteTitle,
                    siteText: res.data.siteText
                });
            })
            .catch(function (err) {

            });

    }

    showSite() {
        return (
            <Card>
                <CardHeader><CardTitle>{this.state.siteTitle}</CardTitle></CardHeader>
                <CardBody>
                    <CardText>
                        <div
                            dangerouslySetInnerHTML={{__html: this.state.siteText}}>
                        </div>
                    </CardText>
                </CardBody>
                {(sessionStorage.getItem('role') == 'admin') && (
                    <CardFooter>
                        <Button color="green" onClick={() => {
                            this.setState({currentAction: "edit"})
                        }}>{this.props.lang.edit}</Button>
                    </CardFooter>
                )}

            </Card>
        );
    }

    editSite() {
        return (
            <Card>
                <CardHeader>
                    <FormInput type="text" value={this.state.siteTitle} id="siteTitle"/>
                </CardHeader>
                <CardBody>
                    <ReactQuill
                        id={this.state.siteKey}
                        value={this.state.siteText}
                        onChange={(value, delta, source, editor) => localStorage.setItem("tmpEditor", editor.getHTML())}
                    />
                </CardBody>
                <CardFooter>
                    <Button color="green" onClick={this.saveEditSite}>{this.props.lang.save}</Button>
                </CardFooter>
            </Card>

        );
    }

    saveEditSite() {
        let self = this;
        let q = require('querystring');
        axios.post(localStorage.getItem('API_URL') + '/static/save', q.stringify({
            siteKey: this.state.siteKey + '_' + this.props.lang.getLanguage(),
            siteTitle: document.getElementById('siteTitle').value,
            siteText: localStorage.getItem('tmpEditor'),
            token: sessionStorage.getItem('loginToken')
        }))
            .then(function (res) {
                self.loadSiteData();
                self.setState({
                   currentAction: 'show'
                });
            })
            .catch(function (err) {
                self.showError(err);
            })
    }

    showError(error) {
        return (
            <div>
                <Alert color="danger">
                    <b>Something went wrong!</b><br/>
                    {error}
                </Alert>
            </div>
        );
    }


    render() {
        if (this.state.currentAction == 'show') {
            return this.showSite();
        } else if (this.state.currentAction == 'edit') {
            return this.editSite();
        } else {
            return this.showError('Action not found!');
        }
    }
}

export default StaticSite;