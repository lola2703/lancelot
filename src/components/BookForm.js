import React from 'react';
import {
    Button,
    Input,
    FormGroup,
    Label,
    InputGroup,
    InputGroupAddon
} from 'reactstrap';
import axios from 'axios';
import FormInput from './../components/FormInput';


class BookForm extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            books: [],
            toggle: false,
            isbnButtonColor: '',
            rating: 1,
            classes: [],
            lang: [],
            searchLang : this.props.lang.getLanguage()
        };
        this.isbnLookup = this.isbnLookup.bind(this);
        this.loadClasses = this.loadClasses.bind(this);


    }


    componentDidMount() {
        this.loadClasses();

        this.setState({
            lang: this.props.lang.getAvailableLanguages().map((lang) => {
                return(
                    <option key={lang} id={lang} value={lang}>{lang}</option>
                )
            })
        });
    }

    loadBook() {
        var self = this;

    }



    isbnLookup() {
        var self = this;
        const querystring = require('querystring');
        const data = querystring.stringify(
            {
                token: sessionStorage.getItem('loginToken')
            }
        )
        axios.post(localStorage.getItem('API_URL') + '/lookup/' + document.getElementById('isbn').value, data)
            .then(function (response) {
                document.getElementById('title').value = response.data.title;
                document.getElementById('author').value = response.data.authors[0].name;
                document.getElementById('release-date').value = response.data.publish_date+'-01-01';
                document.getElementById('count-pages').value = response.data.number_of_pages;

                self.setState({
                    isbnButtonColor: 'success'
                });
            })
            .catch(function (error) {
                console.log(error);
                self.setState({
                    isbnButtonColor: 'danger'
                });
            });
    }
    loadClasses() {
        var self = this;
        axios.get(localStorage.getItem('API_URL') + '/classes')
            .then(function (response) {
                self.setState({classes: response.data.map((claas) => <option key={claas.id} id={claas.id} value={claas.id}>{claas.name}</option>)});
            })
            .catch(function (error) {
                self.setState({showAlert: true});
            });
    }

    render() {
        return (
            <div>
                <FormGroup>
                    <Label for="isbn">{this.props.lang.isbn}</Label>
                    <InputGroup>
                        <InputGroupAddon addonType="append"><Button color={this.state.isbnButtonColor}
                                                                    onClick={this.isbnLookup}>{this.props.lang.lookup}</Button></InputGroupAddon>
                        <Input type="text" id="isbn" key="isbn" name="isbn"/>
                    </InputGroup>
                </FormGroup>
                <FormInput type="text" key="title" id="title" label={this.props.lang.title}/>
                <FormInput type="text" key="author" id="author" label={this.props.lang.author}/>
                <FormInput type="date" key="release-date" id="release-date" label={this.props.lang.releasedate}/>
                <FormInput type="number" key="count-pages" id="count-pages" label={this.props.lang.pagescnt}/>
                <FormInput type="text" key="tags" id="tags" label={this.props.lang.tags}/>
                <FormInput type="number" key="items" id="items" label={this.props.lang.items}/>
                <FormGroup>
                    <Label for="class">{this.props.lang.classrecom}</Label>
                    <Input type="select" name="class" id="class">
                        {this.state.classes}
                    </Input>
                </FormGroup>

                <FormInput type="textarea" key="klappentext" id="klappentext" label={this.props.lang.klappentext} />
                <FormGroup>
                    <Label for="lang">{this.props.lang.lang}</Label>
                    <Input type="select" name="lang" key="lang" id="lang">
                        {this.state.lang}
                    </Input>
                </FormGroup>
                {this.props.cover && <FormInput type="file" key="file" id="file" label="Cover"/> }
            </div>
        );
    }

}

export default BookForm;