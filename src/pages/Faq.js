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

class Faq extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            entries: [],
        }

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentWillMount() {
        var self = this;
        var lang = '/' + this.props.lang.getLanguage();
        if ((sessionStorage.getItem('role') == 'admin' || sessionStorage.getItem('role') == 'manager')) {
            lang = '';
        }
        axios.get(localStorage.getItem('API_URL') + '/faq/get' + lang)
            .then(function (response) {
                var tmp = [];
                response.data.map((entry) => {
                    tmp.push(entry);
                });
                self.setState({
                    entries: tmp
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    onDragEnd = () => {
        // the only one that is required
    };

    render() {
        return (
            <div>

                <Row>
                    <Card>
                        <CardBody>
                            <div
                                dangerouslySetInnerHTML={{__html: localStorage.getItem('faqOpener_' + this.props.lang.getLanguage())}}>

                            </div>
                        </CardBody>
                    </Card>
                </Row>

                <DragDropContext
                    onDragEnd={this.onDragEnd}>

                    {this.state.entries.map((entry, i) => {
                        console.log(i);
                        return (<Draggable isDragDisabled={false} draggableId={"draggable-"+(entry.id + 1)} index={i}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                <Card>
                                    <CardHeader>
                                        <Row>
                                            <CardTitle>
                                                {entry.title}
                                            </CardTitle>
                                        </Row>

                                    </CardHeader>
                                    <CardBody>
                                        <div dangerouslySetInnerHTML={{__html: entry.text}}>

                                        </div>
                                    </CardBody>
                                    {(sessionStorage.getItem('role') == 'admin' || sessionStorage.getItem('role') == 'manager') && (
                                        <CardFooter>
                                            <Link to={"/admin/faq/delete/" + entry.id}><Button
                                                color="danger">{this.props.lang.delete}</Button></Link>
                                            &nbsp;
                                            <Link to={"/admin/faq/edit/" + entry.id}><Button
                                                color="green">{this.props.lang.edit}</Button></Link>
                                        </CardFooter>
                                    )}
                                </Card></div>)}
                        </Draggable>)
                    })}
                </DragDropContext>
            </div>
        );
    }

}

export default Faq;