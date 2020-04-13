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
    CardFooter,
    Row,
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

class Blog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            entries: [],
        }
    }

    componentWillMount() {
        var self = this;
        var lang = '/' + this.props.lang.getLanguage();
        if ((sessionStorage.getItem('role') == 'admin' || sessionStorage.getItem('role') == 'manager')) {
            lang = '';
        }
        axios.get(localStorage.getItem('API_URL') + '/blog/get' + lang)
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

    render() {
        return (
            <div>

                <Row>
                    <Card>
                        <CardBody>
                            <div
                                dangerouslySetInnerHTML={{__html: localStorage.getItem('blogOpener_' + this.props.lang.getLanguage())}}>

                            </div>
                        </CardBody>
                    </Card>
                </Row>

                {this.state.entries.map((entry) => {
                    return (<Card>
                        <CardHeader>
                            <Row>
                                <CardTitle>
                                    {entry.timestamp}: {entry.title}
                                </CardTitle>
                            </Row>

                        </CardHeader>
                        <CardBody>
                            <div dangerouslySetInnerHTML={{__html: entry.text}}>

                            </div>
                        </CardBody>
                        {(sessionStorage.getItem('role') == 'admin' || sessionStorage.getItem('role') == 'manager') && (
                            <CardFooter>
                                <Link to={"/admin/blog/delete/"+entry.id}>{this.props.lang.delete}</Link>
                            </CardFooter>
                        )}
                    </Card>)
                })}
            </div>
        );
    }

}

export default Blog;