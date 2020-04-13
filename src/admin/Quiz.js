import React from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {
    Card,
    CardFooter,
    CardHeader,
    CardBody,
    CardTitle,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
    Button
} from 'reactstrap';
import FormInput from './../components/FormInput';

class Quiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newQuestModal: false,
            tableData: [],
            editModal: false,
            editQuest: [],
            type: 1
        };

        this.loadData = this.loadData.bind(this);
        this.toggle = this.toggle.bind(this);
        this.deleteQuest = this.deleteQuest.bind(this);
        this.changeType = this.changeType.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.editQuest = this.editQuest.bind(this);

        this.loadData();
    }

    loadData() {
        var self = this;
        var id_type = (this.props.book) ? 'book' : 'topic';
        axios.get(localStorage.getItem('API_URL') + '/' + id_type + '/quiz/' + this.props.props.match.params.id)
            .then(function (response) {
                var tmp = [];
                response.data.map(data => {
                    tmp.push({
                        question: data.question,
                        type: (data.type == 1) ? self.props.lang.yesno : self.props.lang.multipleChoice,
                        answers: (data.type == 1) ? ((data.correct_anwser == 1) ? self.props.lang.yes : self.props.lang.no) : data.answers,
                        number: data.number,
                        time_limit: data.time_limit,
                        raw: data,
                        correctAnswer: (data.type == 1) ? data.correct_anwser : data.answers
                    });
                });
                self.setState({
                    tableData: tmp
                });
                /*
                                */
            })
            .catch(function (error) {
                alert(error);
            })
    }

    toggle() {
        this.setState({
            newQuestModal: !this.state.newQuestModal
        });
    }

    addQuestion() {
        var qs = require('querystring');

        var type = document.getElementById('type').value;

        if (document.getElementById('question').value === '') {
            alert(this.props.lang.filloutalert);
            return;
        }

        if (type == 1) {
            var data = qs.stringify({
                type: 1,
                question: document.getElementById('question').value,
                correct_anwser: document.getElementById('correct_anwser').value,
                time_limit: document.getElementById('time_limit').value,
                token: sessionStorage.getItem('loginToken'),
                id: this.props.props.match.params.id,
                id_type: (this.props.book) ? 'book' : 'topic',
                editId: (this.state.editModal) ? this.state.editQuest.raw.id : 0
            });
        } else {
            var data = qs.stringify({
                type: 2,
                question: document.getElementById('question').value,
                anwsers: document.getElementById('anwsers').value,
                correct_anwser: '',
                time_limit: document.getElementById('time_limit').value,
                id: this.props.props.match.params.id,
                id_type: (this.props.book) ? 'book' : 'topic',
                token: sessionStorage.getItem('loginToken'),
                editId: (this.state.editModal) ? this.state.editQuest.raw.id : 0

            });

            if (document.getElementById('anwsers').value === '') {
                alert(this.props.lang.filloutalert);
                return;
            }
        }

        var self = this;
        axios.post(localStorage.getItem('API_URL') + '/admin/quiz/new/', data)
            .then(function (response) {
                if (self.state.editModal) {
                    self.editQuest(0);
                } else {
                    self.toggle();
                }
                self.loadData();
            })
            .catch(function (error) {
                alert(error);
            });
    }


    changeType() {
        this.setState({
            type: document.getElementById('type').value
        });
    }

    deleteQuest(iQuestion) {
        var self = this;
        var q = require('querystring');
        axios.post(localStorage.getItem('API_URL') + '/admin/quiz/question/delete', q.stringify(
            {
                token: sessionStorage.getItem('loginToken'),
                question_id: iQuestion
            }
        ))
            .then(function (response) {
                self.loadData();
            })
            .catch(function (error) {
                alert(error);
            })
    }

    editQuest(iQuestion) {
        if (iQuestion == 0) {
            this.setState({
                editModal: false
            });
            return false;
        }

        this.state.tableData.map((question) => {
            if (question.raw.id == iQuestion) {
                this.setState({
                    editModal: true,
                    editQuest: question,
                    type : question.raw.type
                })
            }
        });
        return true;
    }

    render() {

        var textFieldContent = '';
        if (this.state.editModal) {
            this.state.editQuest.correctAnswer.split(';').map( (t, i ) => {
                if (i == 0) {
                    textFieldContent = t;
                } else {
                    textFieldContent = textFieldContent + '\n' + t;
                }
            });
        }

        return (
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>{this.props.lang.quizEdit}</CardTitle>

                        <CardTitle>&nbsp;&bull;&nbsp;<a className="cursorPointer"
                                                        onClick={this.toggle}><u
                            className="cursorPointer">{this.props.lang.newQuest}</u></a></CardTitle>
                    </CardHeader>
                </Card>
                {
                    this.state.tableData.map((quest, iq) => {
                        return (
                            <Card key={"question_" + iq}>
                                <CardHeader>
                                    <CardTitle>{quest.number}. {quest.question}</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <p>
                                        {this.props.lang.questType}: {quest.type}<br/>
                                        {this.props.lang.timeLimit}: {quest.raw.time_limit} {this.props.lang.seconds}
                                        {
                                            (quest.raw.type == 1) && (
                                                <div>
                                                    {this.props.lang.correctAnwser}: {quest.answers}
                                                </div>
                                            )
                                        }
                                        {
                                            (quest.raw.type == 2) && (
                                                <div>
                                                    {this.props.lang.answers}: {
                                                    quest.answers.split(';').map((t, i) => {
                                                        return (
                                                            <div id={"answer_" + iq + "_" + i}>
                                                                {
                                                                    (i == 0) && (
                                                                        <b>{t}</b>
                                                                    )
                                                                }
                                                                {
                                                                    (i > 0) && (
                                                                        <i>{t}</i>
                                                                    )
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                                </div>
                                            )
                                        }
                                    </p>
                                </CardBody>
                                <CardFooter>
                                    <Button color="danger" onClick={((e) => this.deleteQuest(quest.raw.id))}
                                            id={quest.raw.id}>{this.props.lang.delete}</Button>&nbsp;
                                    <Button color="green" onClick={((e) => this.editQuest(quest.raw.id))}
                                            id={quest.raw.id}>{this.props.lang.edit}</Button>
                                </CardFooter>
                            </Card>

                        )
                    })
                }

                <Modal isOpen={this.state.editModal} toggle={() => this.editQuest(0)}>
                    <ModalHeader toggle={() => this.editQuest(0)}>
                        {this.props.lang.edit}
                    </ModalHeader>
                    <ModalBody>
                        <FormInput type="text" key="question" id="question" name="question"
                                   label={this.props.lang.question} value={this.state.editQuest.question}/>
                        <FormGroup>
                            <Label for="lang">{this.props.lang.questType}</Label>
                            <select name="type" key="type" id="type" className="form-control"
                                    onChange={this.changeType} defaultValue={this.state.type}>
                                <option value="1" >{this.props.lang.yesno}</option>
                                <option value="2">{this.props.lang.multipleChoice}</option>
                            </select>
                        </FormGroup>
                        {
                            this.state.type == 1 && (
                                <FormGroup>
                                    <Label for="lang">{this.props.lang.correctAnswer}</Label>
                                    <select name="type" key="correct_anwser" id="correct_anwser"
                                            className="form-control" defaultValue={this.state.editQuest.correctAnwser}>
                                        <option value="1">{this.props.lang.yes}</option>
                                        <option value="2">{this.props.lang.no}</option>
                                    </select>
                                </FormGroup>
                            )
                        }
                        {
                            this.state.type == 2 && (
                                <FormGroup>
                                    <Label for="lang">{this.props.lang.answers}</Label>
                                    <textarea className="form-control" name="anwsers" id="anwsers" key="anwsers"
                                              rows="5"
                                              placeholder={this.props.lang.helpAnwsers}
                                            defaultValue={textFieldContent}>
                                    </textarea>
                                </FormGroup>
                            )
                        }

                        <FormInput type="number" label={this.props.lang.timeLimit} id="time_limit" name="time_limit"
                                   key="time_limit" value={this.state.editQuest.time_limit}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={this.addQuestion}>{this.props.lang.save}</Button>
                    </ModalFooter>

                </Modal>

                <Modal isOpen={this.state.newQuestModal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>
                        <h2>{this.props.lang.newQuest}</h2>
                    </ModalHeader>
                    <ModalBody>
                        <FormInput type="text" key="question" id="question" name="question"
                                   label={this.props.lang.question}/>
                        <FormGroup>
                            <Label for="lang">{this.props.lang.questType}</Label>
                            <select name="type" key="type" id="type" className="form-control"
                                    onChange={this.changeType}>
                                <option value="1">{this.props.lang.yesno}</option>
                                <option value="2">{this.props.lang.multipleChoice}</option>
                            </select>
                        </FormGroup>
                        {
                            this.state.type == 1 && (
                                <FormGroup>
                                    <Label for="lang">{this.props.lang.correctAnwser}</Label>
                                    <select name="type" key="correct_anwser" id="correct_anwser"
                                            className="form-control">
                                        <option value="1">{this.props.lang.yes}</option>
                                        <option value="2">{this.props.lang.no}</option>
                                    </select>
                                </FormGroup>
                            )
                        }
                        {
                            this.state.type == 2 && (
                                <FormGroup>
                                    <Label for="lang">{this.props.lang.answers}</Label>
                                    <textarea className="form-control" name="anwsers" id="anwsers" key="anwsers"
                                              rows="5"
                                              placeholder={this.props.lang.helpAnwsers}>
                                    </textarea>
                                </FormGroup>
                            )
                        }

                        <FormInput type="number" label={this.props.lang.timeLimit} id="time_limit" name="time_limit"
                                   key="time_limit"/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={this.addQuestion}>{this.props.lang.save}</Button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

export default Quiz;