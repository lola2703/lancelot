import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Footer from './Footer';
import Content from './Content';
import {HashRouter} from 'react-router-dom';
import history from "./History";
import axios from "axios/index";
import {PulseLoader} from 'react-spinners';
import {Alert, Row, Col, Card, CardHeader, CardBody} from 'reactstrap';






class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            configLoaded: false,
            configError: false
        }
    }

    componentWillMount() {
        document.title = this.props.lang.siteName;





        var self = this;
        //Load Config
        if (localStorage.getItem('configLoaded') != 'true') {
            axios.get(localStorage.getItem('API_URL') + '/config')
                .then(function (response) {
                    response.data.map((v) => {
                        localStorage.setItem(v.key, v.value);
                    });
                    localStorage.setItem('configLoaded', 'true');
                    self.setState({
                       configLoaded: true,
                        configError: false
                    });
                })
                .catch(function (err) {
                    self.setState({
                        configError: true
                    });
                })
        } else {
            this.setState({
                configLoaded: true,
                configError: false
            })
        }
    }

    render() {
        if (this.state.configLoaded && !this.props.err) {
            return (
                <HashRouter history={history}>
                    <div id="app">
                        <Header lang={this.props.lang} />
                        <Content lang={this.props.lang} />
                        <Footer lang={this.props.lang}/>
                    </div>
                </HashRouter>
            );
        } else if ( (this.state.configError && !this.state.configLoaded) || this.props.err) {
            return(
                <div id="app" className="bookdriverBootwarning">

                        <Alert color="danger">
                            Something went wrong.<br />
                            Es ist ein Fehler aufgetreten.<br />
                            Une erreur s'est produite.
                        </Alert>

                </div>
            )
        } else {
            return(
                <div id="app">
                    <center>
                        <br />
                        <br />
                        Loading application...<br />
                        <PulseLoader
                            loading={true}
                            color="#36D7B7"
                        />
                    </center>
                </div>
            )
        }
    };
}

export default App;