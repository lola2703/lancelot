import React from 'react';
import {
    Input,
    Label,
    FormGroup
} from 'reactstrap';

class FormInput extends React.Component {
    render() {
        return(
            <FormGroup>
                <Label for={this.props.id}>{this.props.label}</Label>
                <Input type={this.props.type} name={this.props.id} id={this.props.id} defaultValue={ (this.props.value) ? this.props.value : ''} />
            </FormGroup>
        );
    }
}

export default FormInput;