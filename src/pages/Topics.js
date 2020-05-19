import React from 'react';
import axios from 'axios';
import {
    Modal,
    ModalFooter,
    ModalHeader,
    ModalBody,
    Card,
    CardTitle,
    CardFooter,
    CardHeader,
    CardBody,
    CardSubtitle,
    Row,
    Col,
    FormGroup,
    Label,
    Input,
    Button
} from 'reactstrap';
import {Link} from 'react-router-dom';
import FormInput from "../components/FormInput";
import PlayQuiz from "../components/PlayQuiz";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


class Topics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            topics: [],
            modalState: false,
            modalTitel: '',
            modalLang: '',
            modalText: '',
            modalEdit: false,
            modalRead: false,
            modalPicture: '',
            openId: 0

        };

        this.loadData = this.loadData.bind(this);
        this.toggle = this.toggle.bind(this);
        this.addTopic = this.addTopic.bind(this);
        this.startQuiz = this.startQuiz.bind(this);
        this.loadText = this.loadText.bind(this);
        this.loadTextRead = this.loadTextRead.bind(this);
        this.toggleRead = this.toggleRead.bind(this);
        this.deleteTopic = this.deleteTopic.bind(this);
    }

    startQuiz() {
        this.setState({
            quizOpen: !this.state.quizOpen
        });
    }

    deleteTopic() {
        const querystring = require('querystring');
        var self = this;
        axios.post(localStorage.getItem('API_URL') + '/admin/topics/delete', querystring.stringify({
            token: sessionStorage.getItem('loginToken'),
            id: this.state.openId
        }))
            .then(function (res) {
                self.toggle();
                self.loadData();
            })
    }

    componentWillMount() {
        this.loadData();
    }

    loadData() {
        var self = this;

        if (this.props.modalRead) {
            this.loadTextRead(this.props.modalId);
        } else {

            axios.get(localStorage.getItem('API_URL') + '/topics')
                .then(function (response) {
                    var tmp = [];
                    console.log(response);
                    response.data.map(topic => {
                        console.log(topic);
                        tmp.push(topic);
                    });
                    self.setState({
                        topics: tmp
                    });
                })
                .catch(function (error) {
                    alert(error);
                });
        }
    }

    toggle() {
        this.setState({
            modalState: !this.state.modalState,
            modalEdit: false
        });
    }

    addTopic() {
        const querystring = require('querystring');
        const config = {
            // headers: { 'content-type': 'multipart/form-data' }
        }

        var self = this;

        if (this.state.modalEdit) {
            axios.post(localStorage.getItem('API_URL') + '/admin/topics/edit', querystring.stringify({
                token: sessionStorage.getItem('loginToken'),
                id: self.state.openId,
                title: document.getElementById('newTopic').value,
                text: self.state.modalText
            }))
                .then(function (res) {
                    self.toggle();
                    self.loadData();
                })
                .catch(function (err) {
                    alert(err);
                })
        } else {

            var title = document.getElementById('newTopic').value;
            var file = document.getElementById('file').files[0];
            if (title == "") {
                alert(this.props.lang.filloutalert);
            } else {

                var data = new FormData();
                data.append('token', sessionStorage.getItem('loginToken'));
                data.append('file', file);
                data.append('lang', document.getElementById('lang').value);
                data.append('title', title);
                data.append('text', this.state.modalText);

                axios.post(localStorage.getItem('API_URL') + '/admin/topics/add', data, config)
                    .then(function (response) {
                        self.toggle();
                        self.loadData();
                    })
                    .catch(function (error) {
                        alert(error);
                    });
            }
        }
    }

    loadText(id) {
        var self = this

        axios.get(localStorage.getItem('API_URL') + '/topic/' + id)
            .then(function (response) {
                self.setState({
                    modalTitle: response.data[0].title,
                    modalText: response.data[0].text,
                    modalLang: response.data[0].lang,
                    modalState: true,
                    modalEdit: true,
                    openId: id
                });
                document.getElementById('newTopic').value = response.data[0].title;
            })
            .catch(function (err) {
                alert(err);
            })
    }

    loadTextRead(id) {
        var self = this

        axios.get(localStorage.getItem('API_URL') + '/topic/' + id)
            .then(function (response) {
                self.setState({
                    modalTitle: response.data[0].title,
                    modalText: response.data[0].text,
                    modalLang: response.data[0].lang,
                    modalPicture: response.data[0].cover,
                    modalState: false,
                    modalRead: true,
                    modalEdit: false,
                    openId: id
                });
            })
            .catch(function (err) {
                alert(err);
            })
    }

    toggleRead() {
        this.setState({
            modalRead: !this.state.modalRead
        })
    }

    render() {
        if (this.props.modalRead) {
            return (
                <Card>
                    <CardHeader>
                        <h2>{this.state.modalTitle}</h2>
                    </CardHeader>
                    <CardBody>
                        <div
                            dangerouslySetInnerHTML={{__html: this.state.modalText}}>
                        </div>
                    </CardBody>
                </Card>);
        } else {
            return (
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {this.props.lang.navTopics}
                                {(this.props.admin) && (<span>&nbsp;&bull;&nbsp; <a className="cursorPointer"
                                                                                    onClick={this.toggle}><u>{this.props.lang.newTopic}</u></a></span>)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Row>
                        {this.state.topics.map((topic, key) => {
                                return (
                                    <Col sm="3" key={topic.id}>
                                        <Card>
                                            <CardHeader className="bookdriverImageCard">
                                                <img
                                                    src={localStorage.getItem('API_URL').replace('index.php', '') + '/thumb.php?x=200&y=200&bild=' + topic.cover}/>
                                            </CardHeader>
                                            <CardBody id={key}>
                                                <CardTitle>
                                                    {topic.title}
                                                </CardTitle>
                                                {(this.props.admin) && (
                                                    <div>
                                                        <CardSubtitle>{this.props.lang.language}: {topic.lang}</CardSubtitle>
                                                        {
                                                            <Button
                                                                onClick={() => this.loadText(topic.id)}>{this.props.lang.edit}</Button>
                                                        }
                                                    </div>
                                                )}

                                            </CardBody>

                                            {(topic.text != null) && (
                                                <CardFooter>
                                                    <Link to={"/topic/" + topic.id}> {this.props.lang.read}</Link>

                                                </CardFooter>
                                            )}

                                        </Card>
                                    </Col>);
                            }
                        )}
                    </Row>

                    <Modal isOpen={this.state.modalState} toggle={this.toggle}>
                        <ModalHeader toggle={this.toggle}>
                            <CardTitle>{this.props.lang.newTopic}</CardTitle>
                        </ModalHeader>
                        <ModalBody>
                            <FormInput type="text" id="newTopic" key="newTopic" lang={this.props.lang}
                                       label={this.props.lang.newTopic}/>
                            {(!this.state.modalEdit) && (
                                <FormInput type="file" key="file" id="file" label="Cover"/>
                            )}
                            {(!this.state.modalEdit) && (
                                <FormGroup>


                                    <Label for="lang">{this.props.lang.lang}</Label>
                                    <Input type="select" name="lang" key="lang" id="lang">
                                        {this.props.lang.getAvailableLanguages().map((lang) => {
                                            return (
                                                <option key={lang} id={lang} value={lang}>{lang}</option>
                                            )
                                        })}
                                    </Input>
                                </FormGroup>)}
                            <FormGroup>
                                <Label for="text">{this.props.lang.text}</Label>
                                <ReactQuill
                                    id="topicText"
                                    value={this.state.modalText}
                                    onChange={(value, delta, source, editor) => this.setState({modalText: editor.getHTML()})}
                                />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>

                            {(this.state.modalEdit) && (
                                <Button color="red" onClick={this.deleteTopic}>{this.props.lang.delete}</Button>
                            )}

                            <Button color="success" onClick={this.addTopic}>{this.props.lang.save}</Button>
                        </ModalFooter>
                    </Modal>


                    <Modal isOpen={this.state.requestOpen}>
                        <ModalHeader toggle={this.requestToggle}>
                            <h1>{this.props.lang.request}</h1>
                        </ModalHeader>
                        <ModalBody>
                            <FormInput type="number" label={this.props.lang.items} id="quantity" key="quantity"/>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={this.requestSend}>{this.props.lang.request}</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.quizOpen}>
                        <ModalBody>
                            <PlayQuiz topic_id={this.state.id} lang={this.props.lang}/>
                        </ModalBody>
                    </Modal>

                </div>

            )
        }
    }

}

export default Topics;