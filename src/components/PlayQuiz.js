/**
 * @TODO:
 * - Nach dem Beenden Ergebnis speichern
 * - Übersetzen
 * - Quiz bewerten
 */


import React from 'react';
import {
    Card,
    CardHeader,
    CardFooter,
    CardBody,
    CardText,
    CardTitle,
    CardSubtitle,
    Row,
    Col,
    Button,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import axios from 'axios';
import ReactCountdownClock from 'react-countdown-clock';
import {PacmanLoader} from 'react-spinners';
import {Redirect, Link} from 'react-router-dom';

class PlayQuiz extends React.Component {

    constructor(props) {
        super(props);


        if (this.props.book_id != '') {

            var type = 'book';
            var id = this.props.book_id;

        } else {

            var type = 'topic';
            var id = this.props.topic_id;
        }

        this.state = {
            type: type,
            id: id,
            questions: [],
            points: 0,
            correct: 0,
            incorrect: 0,
            quizAlreadyDone: false,
            quizDone: false,
            pleaseWait: true,
            currentQuestion: -1,
            answers: [],
            nextBtn: -1,
            countdownPaused: false,
            colorBtn: 'primary',
            userStat: []
        };

        this.renderAlreadyPlayed = this.renderAlreadyPlayed.bind(this);
        this.renderQuiz = this.renderQuiz.bind(this);
        this.renderQuizDone = this.renderQuizDone.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.sendResult = this.sendResult.bind(this);
    }

    componentWillMount() {
        var self = this;

        //Prüfen, ob der Nutzer das Quiz schon gespielt hat
        var q = require('querystring');
        axios.post(localStorage.getItem('API_URL') + '/quiz/stat', q.stringify({token: sessionStorage.getItem('loginToken'), quiz: this.state.id}))
            .then(function (response) {

                if (response.data.length > 0) {
                    var tmp = [];
                    response.data.map((result) => {
                        tmp.push(result);
                    });
                    self.setState({
                        quizAlreadyDone: true,
                        pleaseWait: false,
                        userStat: tmp
                    });
                }
            })

        axios.get(localStorage.getItem('API_URL') + '/' + this.state.type + '/quiz/' + this.state.id)
            .then(function (response) {
                var tmp = [];
                response.data.map((question) => {
                    tmp.push(question);
                });
                self.setState({
                    questions: tmp,
                    pleaseWait: false
                });
            })

    }

    renderAlreadyPlayed() {
        var redirectLink = '';
        if (this.props.book_id != '') {
            redirectLink = '/book/' + this.props.book_id;
        } else {
            redirectLink = '/topic/' + this.props.topic_id;
        }

        var iCorrect = 0;
        var iPoints = 0;
        this.state.userStat.map( (stat) => {

            if (stat.correct == 1) {
                iCorrect++;
                iPoints += 1;
            }
        });

        return (
            <Card>
                <CardHeader>
                    <CardTitle>{this.props.lang.alreadyPlayed}</CardTitle>
                </CardHeader>

                <CardBody>
                    {this.props.lang.formatString(this.props.lang.alreadyPlayedDetail, iCorrect, iPoints)}

                </CardBody>

                <CardFooter>
                    <Button color="success" onClick={() => window.location.reload(true)}>{this.props.lang.close}</Button>
                </CardFooter>
            </Card>
        );
    }

    sendResult() {
        window.location.reload(true);
    }

    renderQuizDone() {

        var iCorrect = 0;
        this.state.answers.map((e) => {
            if (e[1] == true) {
                iCorrect++;
            }
        });

        //Statistik senden
        var self = this;
        var q = require('querystring');
        axios.post(localStorage.getItem('API_URL') + '/quiz/result/add', q.stringify({
            token: sessionStorage.getItem('loginToken'),
            answers: JSON.stringify(this.state.answers),
            quiz_id: this.state.id
        }))
            .then(function(response) {
            }).catch(function (err) {
            console.log(err);
        });


        return (
            <div>
                <CardHeader>
                    <CardTitle>
                        {this.props.lang.youredone}
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <CardTitle>
                        {this.props.lang.formatString(this.props.lang.done1, iCorrect)}<br/>
                    </CardTitle>
                    {this.props.lang.formatString(this.props.lang.done3, this.state.points)}
                </CardBody>
                <CardFooter>
                    <Button color="success" onClick={this.sendResult}>{this.props.lang.close}</Button>
                </CardFooter>
            </div>
        );
    }

    nextQuestion() {
        this.setState({
            currentQuestion: this.state.currentQuestion + 1,
            countdownPaused: false,
            colorBtn: 'primary'
        });
    }

    checkAnswer() {
        if (this.state.countdownPaused) return;
        var tmp = this.state.answers;
        if (document.getElementById('richtig').checked) {
            var points = 1;
            var tmp2 = [];
            tmp2.push(this.state.currentQuestion);
            tmp2.push(true);
            tmp.push(tmp2);
        } else {
            var points = 0;
            var tmp2 = [];
            tmp2.push(this.state.currentQuestion);
            tmp2.push(false);
            tmp.push(tmp2);
        }
        this.setState({
            points: this.state.points + points,
            nextBtn: this.state.currentQuestion,
            countdownPaused: true,
            colorBtn: (document.getElementById('richtig').checked) ? 'success' : 'danger',
            answers: tmp
        });

        // }
    }

    renderQuiz() {

        if (this.state.questions.length == 0) {
            return(
              <div>
                  <CardHeader>
                      <CardTitle>{this.props.lang.errorTitle}</CardTitle>
                  </CardHeader>
                  <CardBody>
                      {this.props.lang.noquiz}
                  </CardBody>
                  <CardFooter>
                      <Button color="success" onClick={() => window.location.reload(true)}>{this.props.lang.close}</Button>
                  </CardFooter>
              </div>
            );
        }


        if ((this.state.currentQuestion + 1) > this.state.questions.length) {
            this.setState({
                quizDone: true
            });
        } else {

            if (this.state.currentQuestion == -1) {
                return (
                    <div>
                        <CardBody>
                            <center>
                                <CardTitle>
                                    {this.props.lang.quizCardTitle}
                                </CardTitle>
                                <CardSubtitle>
                                    {this.props.lang.quizCardSubtitle1}
                                </CardSubtitle>
                                <CardSubtitle>
                                    {this.props.lang.formatString(this.props.lang.quizCardSubtitle2, this.state.questions.length)}
                                </CardSubtitle>
                                <Button color="success"
                                        onClick={() => this.setState({currentQuestion: 0})}>Start</Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button color="danger" onClick={() => window.location.reload(true)}>{this.props.lang.close}</Button>
                            </center>
                        </CardBody>

                    </div>
                );
            }

            var current = this.state.questions[this.state.currentQuestion];

            //Time Limits mit 0 Sekunden abfangen...
            if (current.time_limit == 0) {
                current.time_limit = 60;
            }


            if (current.type == "2") {
                var shuffle = require('shuffle-array');
                return (
                    <div>
                        <CardHeader>
                            <ReactCountdownClock
                                seconds={current.time_limit}
                                size={30}
                                showMilliseconds={false}
                                paused={this.state.countdownPaused}
                                color={'rgb(146,208,80)'}
                                onComplete={this.checkAnswer}

                            />
                            <CardTitle>
                                &nbsp;&nbsp;{current.question}
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            <FormGroup>
                                {
                                    shuffle(this.state.questions[this.state.currentQuestion].answers.split(';')).map((antwort, key) => {
                                        if (antwort == "") {
                                            return (<div></div>);
                                        }
                                        return (
                                            <FormGroup check>
                                                <Label check>
                                                    <Input type="radio" name="antworten"
                                                           id={(antwort == this.state.questions[this.state.currentQuestion].answers.split(';')[0]) ? 'richtig' : 'falsch_' + key}/>{' '}
                                                    {antwort}
                                                </Label>
                                            </FormGroup>
                                        )
                                    })
                                }
                            </FormGroup>
                        </CardBody>
                        <CardFooter>
                            <Button color={this.state.colorBtn} onClick={this.checkAnswer}>Check</Button>
                            &nbsp;&nbsp;&nbsp;
                            {(this.state.nextBtn == this.state.currentQuestion) && (
                                <Button color="primary" onClick={this.nextQuestion}>Next</Button>
                            )}
                        </CardFooter>
                    </div>
                )
            } else {
                //Type: Ja / Nein
                return (
                    <div>
                        <CardHeader>
                            <ReactCountdownClock
                                seconds={current.time_limit}
                                size={30}
                                paused={this.state.countdownPaused}
                                showMilliseconds={false}
                                color={'rgb(146,208,80)'}
                                onComplete={this.checkAnswer}
                            />
                            <CardTitle>
                                &nbsp;&nbsp;{current.question}
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            <FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="radio" name="antworten"
                                               id={(current.correct_anwser == "1") ? 'richtig' : 'falsch'}/>{' '}
                                        {this.props.lang.yes}
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="radio" name="antworten"
                                               id={(current.correct_anwser == "2") ? 'richtig' : 'falsch'}/>{' '}
                                        {this.props.lang.no}
                                    </Label>
                                </FormGroup>
                            </FormGroup>
                        </CardBody>
                        <CardFooter>
                            <Button color={this.state.colorBtn} onClick={this.checkAnswer}>Check</Button>
                            &nbsp;&nbsp;&nbsp;
                            {(this.state.nextBtn == this.state.currentQuestion) && (
                                <Button color="primary" onClick={this.nextQuestion}>Next</Button>
                            )}
                        </CardFooter>
                    </div>)
            }

        }
    }

    render() {

        if (this.state.pleaseWait) {
            return (
                <Card>
                    <CardBody>
                        <center>
                            <PacmanLoader
                                loading={true}
                                color={'#123abc'}
                            /></center>
                        <br/>
                    </CardBody></Card>
            );
        } else {
            return (
                <div>
                    {(this.state.quizAlreadyDone) &&
                    this.renderAlreadyPlayed()
                    }
                    {(this.state.quizDone) &&
                    this.renderQuizDone()
                    }
                    {(!this.state.quizAlreadyDone && !this.state.quizDone) &&
                    this.renderQuiz()
                    }
                </div>
            );
        }
    }

}

export default PlayQuiz;
