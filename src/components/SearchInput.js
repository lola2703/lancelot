import React from 'react';
import {Redirect} from 'react-router-dom';

class SearchInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        };
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.setState({
                redirect: true,
            });
        }
    }

    render() {
        if (this.state.redirect && document.getElementById('search') !== null) {
            console.log(document.getElementById('search'));
            return <Redirect to={"/books/" + document.getElementById('search').value}/>
        } else {
            return <input type="search" id="search" className="form-control header-search"
                          placeholder="Search book&hellip;" tabIndex="1" onKeyPress={this._handleKeyPress}/>
        }
    }
}

export default SearchInput;