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
    CardBody,
    CardHeader,
    Row,
    CardFooter,
    CardTitle,
    CardSubtitle,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from 'reactstrap';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import {DragDropContext, Draggable} from 'react-beautiful-dnd';

import ReactChartkick, {ColumnChart, LineChart, PieChart} from 'react-chartkick'
import Chart from 'chart.js'
import ReactTable from "react-table";

class History extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true
        }
    }

    componentWillMount() {
        var self = this;
        var q = require('querystring');

        axios.post(localStorage.getItem('API_URL') + '/stat/allread', q.stringify({
            token: sessionStorage.getItem('loginToken')
        }))
            .then(function (response) {
                self.setState({
                    data: response.data,
                    loading: false
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    render() {

        var   columns = [{
            Header: this.props.lang.date,
            accessor: 'date'
        }, {
            id: 'title',
            Header: this.props.lang.title,
            accessor: d => <Link to={"/book/"+d.id}><u>{d.title}</u></Link>
        }, {
            Header: this.props.lang.author,
            accessor: 'author'
        }, {
            Header: this.props.lang.class,
            accessor: 'klasse'
        }, {
            Header: this.props.lang.points,
            accessor: 'points'
        }];


        return (
            <div>
                <Card>
                    <CardHeader>
                        <h2>{this.props.lang.leseprofil}</h2>
                    </CardHeader>
                    <CardBody>
                        <ReactTable
                            data={this.state.data}
                            columns={columns}
                            filterable={true}
                            showPagination={true}
                            defaultPageSize={10}
                            loading={this.state.loading}
                        />                    </CardBody>
                </Card>


            </div>
        );
    }

}

export default History;