import React from 'react';
import axios from 'axios';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Row,
    Col,
    Button
} from 'reactstrap';


class Requests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };

        this.loadData = this.loadData.bind(this);
        this.deleteRequest = this.deleteRequest.bind(this);
        this.acceptRequest = this.acceptRequest.bind(this);
        this.loadData();
    }

    loadData() {
        var self = this;
        var q = require('querystring');
        axios.post(localStorage.getItem('API_URL')+'/requests/get', q.stringify({token: sessionStorage.getItem('loginToken')}))
            .then(function (response) {
                var tmp = [];
                response.data.map( (v,k) => {
                   tmp.push(v);
                });
                self.setState({
                   data: tmp
                });
            })
            .catch(function (err) {

            })
    }

    acceptRequest(i) {
        var self = this;
        var q = require('querystring');

        axios.post(localStorage.getItem('API_URL')+'/requests/delete', q.stringify({token: sessionStorage.getItem('loginToken'), id: i, accept: true}))
            .then(function (response) {
                self.loadData();
            })
            .catch(function (err) {
                alert(err);
            })
    }

    deleteRequest(i) {
        var self = this;
        var q = require('querystring');

        axios.post(localStorage.getItem('API_URL')+'/requests/delete', q.stringify({token: sessionStorage.getItem('loginToken'), id: i, accept: false}))
            .then(function (response) {
                self.loadData();
            })
            .catch(function (err) {
                alert(err);
            })
    }

    render() {
        return(
         <Card>
             <CardHeader>
                 <CardTitle>{this.props.lang.request}</CardTitle>
             </CardHeader>
             {
                 this.state.data.map( (request,i) => {

                     return(
                     <CardBody key={i}>
                         <Row>
                             <Col md="2">
                                 <center><img
                                     src={localStorage.getItem('API_URL') + '/upload_files/' + request.book.cover}
                                     height="100"/></center>
                             </Col>
                             <Col lg="8">
                                 <Row>
                                     <Col md="3"><b>{this.props.lang.title} ({this.props.lang.author})</b></Col>
                                     <Col md="4">{request.book.title} ({request.book.author})</Col>
                                 </Row>
                                 <Row>
                                     <Col md="3"><b>{this.props.lang.items}</b></Col>
                                     <Col md="4">{request.request.count}</Col>
                                 </Row>
                                 <Row>
                                     <Col md="3"><b>{this.props.lang.school}</b></Col>
                                     <Col md="4">{request.school.name}</Col>
                                 </Row>
                                 <Row>
                                     <Col md="3"><b>{this.props.lang.teach}</b></Col>
                                     <Col md="4">{request.user.username}</Col>
                                 </Row>
                                 <Row>
                                     <Col md="3"><b>{this.props.lang.request_time}</b></Col>
                                     <Col md="4">{request.request.time}</Col>
                                 </Row>
                             </Col>
                             <Col md="2">
                                 <Row>
                                     <Button color="success" onClick={((e) => this.acceptRequest(request.request.id))}>{this.props.lang.accept}</Button>
                                 </Row>
                                 <Row>
                                     <Button color="danger" onClick={((e) => this.deleteRequest(request.request.id))}>{this.props.lang.decline}</Button>
                                 </Row>
                             </Col>
                         </Row>
                     </CardBody>
                     )
                 })
             }
         </Card>
        )
    }
}

export default Requests;