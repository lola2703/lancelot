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
import FormInput from "../components/FormInput";

class Statistic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }

        this.loadData = this.loadData.bind(this);
    }

    componentWillMount() {
        var self = this;
        var q = require('querystring');

        axios.post(localStorage.getItem('API_URL') + '/stat/month', q.stringify({
            token: sessionStorage.getItem('loginToken')
        }))
            .then(function (response) {
                self.setState({
                    data: response.data
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        /*
        if (sessionStorage.getItem('role') == 'teacher') {
            axios.post(localStorage.getItem('API_URL') + '/stat/teacher/filterdata', q.stringify({
                token: sessionStorage.getItem('loginToken')
            }))
                .then(function (response) {
                    self.setState({
                        schools: response.data.schools.map((school) => <option key={school.id}
                                                                       value={school.id}>{school.name}</option>)
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        }*/
    }

    loadData() {
        var self = this;
        var q = require('querystring');

        axios.post(localStorage.getItem('API_URL') + '/stat/teacher', q.stringify({
            token: sessionStorage.getItem('loginToken')
        }))
            .then(function (response) {
                self.setState({
                    data: response.data
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    render() {
        return (
            <div>

                {(sessionStorage.getItem('role') == 'teacher') && (
                    <Card>
                        <CardHeader>
                            <h2>Filter</h2>
                        </CardHeader>
                        <CardBody>
                            <FormGroup>
                                <Label for="student">{this.props.lang.student}</Label>
                                <Input type="select" name="student" id="student">
                                    <option value={"0"}>---</option>
                                    {this.state.students}
                                </Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="school">{this.props.lang.school}</Label>
                                <Input type="select" name="school" id="school">
                                    <option value={"0"}>---</option>
                                    {this.state.schools}
                                </Input>
                            </FormGroup>

                            <FormInput
                                type="year"
                                label={this.props.lang.year}
                                id="year"
                                value={new Date().getFullYear()}
                            />

                        </CardBody>
                        <CardFooter>
                            <Button color="green" onClick={this.loadData}>{this.props.lang.load}</Button>
                        </CardFooter>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <h2>{this.props.lang.stat}</h2>
                    </CardHeader>
                    <CardBody>
                        <ColumnChart data={this.state.data.data} />
                    </CardBody>
                </Card>


            </div>
        );
    }

}

export default Statistic;