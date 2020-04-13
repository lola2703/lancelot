import React from 'react';
import axios from 'axios';
import {
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap';
import {Redirect} from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import FormInput from "../components/FormInput";


class AdminConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: [],
            editModal: false,
            editId: 0,
            editValue: '',
            editObject: null
        }
        this.handleChange = this.handleChange.bind(this)
        this.save = this.save.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.load = this.load.bind(this);
    }

    handleChange(value) {
        this.setState({text: value})
    }

    save(d) {
        var self = this;
        var q = require('querystring');


        var value = (d.type == 'text') ? document.getElementById(d.key).value : localStorage.getItem(d.key);


        axios.post(localStorage.getItem('API_URL') + '/admin/config/update', q.stringify({
            'token': sessionStorage.getItem('loginToken'),
            'key': d.key,
            'value': value
        }))
            .then(function (response) {
                localStorage.setItem(d.key, value);
                self.load();
            })
            .catch(function (error) {
                alert(error);
            })

        if (this.state.editModal) {
            this.setState({
               editModal: false
            });
        }
    }

    componentWillMount() {
        this.load();
    }

    load() {
        var self = this;
        var q = require('querystring');
        axios.get(localStorage.getItem('API_URL') + '/config')
            .then(function (response) {
                var aConfig = [];
                response.data.map((v) => {
                    aConfig.push(v);
                });
                self.setState({
                    config: aConfig
                })
            })
            .catch(function (err) {
                alert(err);
            })
    }

    toggleEdit(d) {
        this.setState({
            editModal: !this.state.editModal,
            editId: d.key,
            editValue: d.value,
            editObject: d
        })
    }

    render() {
        var columns = [{
            Header: 'Key',
            accessor: 'key'
        }, {
            Header: 'Description',
            accessor: 'description'
        }, {
            Header: '',
            id: 'options',
            accessor: d => (<Button onClick={() => this.toggleEdit(d)}>{this.props.lang.edit}</Button>)
        }];

        return (
            <div>
                <ReactTable
                    data={this.state.config}
                    columns={columns}
                    filterable={true}
                    showPagination={true}
                    defaultPageSize={10}
                />

                <Modal isOpen={this.state.editModal}>
                    <ModalHeader>
                        {this.props.lang.edit}
                    </ModalHeader>
                    <ModalBody>
                        {(this.state.editObject != null && this.state.editObject.type == 'text') &&
                            <Input  type="text" id={this.state.editObject.key}  defaultValue={this.state.editObject.value} />
                        }
                        {(this.state.editObject != null && this.state.editObject.type != 'text') &&
                            <ReactQuill
                                id={this.state.editId}
                                value={this.state.editValue}
                                onChange={(value, delta, source, editor) => localStorage.setItem(this.state.editId, editor.getHTML())}
                            />
                        }
                        </ModalBody>
                    <ModalFooter>
                        <Button color="green" onClick={(e) => this.save(this.state.editObject)}>{this.props.lang.save}</Button>
                    </ModalFooter>
                </Modal>

            </div>
        )
    }
}

export default AdminConfig;