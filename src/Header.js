import React from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    ButtonDropdown,
    Input,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
    Dropdown,
    UncontrolledDropdown
} from 'reactstrap';
import {NavLink, Link, Redirect} from "react-router-dom";
import headerImage from './images/header_image.png';
import {isMobile} from 'react-device-detect';
import SearchInput from './components/SearchInput';
import LoginForm from "./components/Login";


class Header extends React.Component {

    constructor(props) {
        super(props);


        this.toggle = this.toggle.bind(this);
        this.adminToggle = this.adminToggle.bind(this);
        this.state = {
            isOpen: !isMobile,
            dropdownOpen: false,
            redirectSearch: false,
            searchQuery: ''
        };

        this.test = this.test.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    adminToggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }


    lang() {
        sessionStorage.setItem('lang', 'fr');
        this.props.lang.setLanguage('fr');

        this.setState({});
    }

    test(event) {
        if (event.key == 'Enter') {
            this.setState({
                redirectSearch: true,
                searchQuery: document.getElementById("searchBook").value
            });
        }
    }


    render() {


        return (
            <div>
                {(this.state.redirectSearch) && (
                    <Redirect to={"/books/" + this.state.searchQuery}/>
                )}
                <div className="header">
                    <div className="container">
                        <div className="d-flex">
                            <Navbar color="inverse" light expand="md">
                                <NavbarBrand href="/">
                                    <img src={headerImage} className="header-brand-img" />
                                </NavbarBrand>
                                <NavbarToggler onClick={this.toggle}/>
                            </Navbar>
                        </div>
                    </div>
                </div>

                <Collapse isOpen={this.state.isOpen} navbar>

                    <div className="header d-lg-flex p-0 bg-bookdriver" id="">
                        <div className="container">
                            <div className="row align-items-center">

                                <div className="col-lg-3 ml-auto">
                                    <form className="input-icon my-3 my-lg-0">
                                        <input type="search" className="form-control header-search" id="searchBook"
                                               placeholder="Search book…" tabIndex="1" onKeyPress={this.test}/>
                                        <div className="input-icon-addon">
                                            <i className="fe fe-search"></i>
                                        </div>
                                    </form>
                                </div>


                                <div className="col-lg order-lg-first">


                                    {/*  {sessionStorage.getItem('bLogin') == 'true' && (*/}

                                    <Nav className="nav nav-tabs border-0 flex-column flex-lg-row ml-auto" navbar>

                                        {(sessionStorage.getItem('bLogin') === 'true') && (<NavItem>
                                            <NavLink to="/" className="nav-link active" activeClassName="active"><i
                                                className="fe fe-home"></i> <b>&nbsp;{this.props.lang.navHome}</b>
                                            </NavLink>
                                        </NavItem>)}


                                        {/*        <NavItem>
                                                <NavLink to="/" className="nav-link active" activeClassName="active"><i
                                                    className="fe fe-home"></i> <b>&nbsp;{this.props.lang.navHome}</b>
                                                </NavLink>
                                            </NavItem>*/}


                                        {(sessionStorage.getItem('bLogin') !== 'true') && (
                                            <UncontrolledDropdown setActiveFromChild>
                                                <DropdownToggle tag="a" className="nav-link active" caret>
                                                    <i className="fe fe-home"></i><b>&nbsp;{(sessionStorage.getItem('bLogin') === 'true') ? this.props.lang.navHome : this.props.lang.login}</b>
                                                </DropdownToggle>
                                                <DropdownMenu className="bookdriverDropdown">
                                                    <div className="bookdriverDropdown2">
                                                        <LoginForm lang={this.props.lang} card={true}/>
                                                    </div>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>)}


                                        <NavItem>
                                            <NavLink to="/books" className="nav-link active"
                                                     activeClassName="active"><i className="fe fe-box"></i>
                                                <b>&nbsp;{this.props.lang.navBooks}</b> </NavLink>
                                        </NavItem>

                                        <NavItem>
                                            <NavLink to="/newbooks" className="nav-link active"
                                                     activeClassName="active"><i className="fe fe-box"></i>
                                                <b>&nbsp;{this.props.lang.navNewBooks}</b> </NavLink>
                                        </NavItem>

                                        <NavItem>
                                            <NavLink to="/topics" className="nav-link active"
                                                     activeClassName="active"><i className="fe fe-box"></i>
                                                <b>&nbsp;{this.props.lang.navTopics}</b> </NavLink>
                                        </NavItem>

                                        <NavItem>
                                            <NavLink to="/license" className="nav-link active"
                                                     activeClassName="active"><i
                                                className="fe fe-file-text"></i>
                                                <b>&nbsp;{this.props.lang.navLicense}</b> </NavLink>
                                        </NavItem>

                                        <NavItem>
                                            <NavLink to="/faq" className="nav-link active"
                                                     activeClassName="active"><i
                                                className="fe fe-file-text"></i>
                                                <b>&nbsp;{this.props.lang.navHelp}</b> </NavLink>
                                        </NavItem>


                                        <NavItem>
                                            <NavLink to="/blog" className="nav-link active"
                                                     activeClassName="active"><i className="fe fe-image"></i>
                                                <b>&nbsp;{this.props.lang.navBlog}</b> </NavLink>
                                        </NavItem>




                                        {/*sessionStorage.getItem('role') == 'teacher' || (sessionStorage.getItem('role') == 'admin' || sessionStorage.getItem('role') == 'manager') &&
                                        (
                                            <NavItem>
                                                <NavLink to="/teacher" className="nav-link active"
                                                         activeClassName="active"><i className="fe fe-box"></i>
                                                    <b>&nbsp;Teacher</b> </NavLink>
                                            </NavItem>

                                        )
                                        */<div></div>}

                                        { ( (sessionStorage.getItem('role') == 'admin' || sessionStorage.getItem('role') == 'manager') || sessionStorage.getItem('role') == 'manager') && (
                                            <UncontrolledDropdown setActiveFromChild>
                                                <DropdownToggle tag="a" className="nav-link active" caret>
                                                    <i className="fe fe-box"></i><b>&nbsp;Management</b>
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem header>{this.props.lang.navContent}</DropdownItem>
                                                    <DropdownItem onClick={() => window.location.href="#/admin/books"}>{this.props.lang.navBooks}</DropdownItem>
                                                    <DropdownItem onClick={() => window.location.href="#/admin/topics"}>{this.props.lang.navTopics}</DropdownItem>
                                                    <DropdownItem divider/>
                                                    <DropdownItem header>Management</DropdownItem>
                                                    <DropdownItem onClick={() => window.location.href="#/admin/requests"}>{this.props.lang.navRequests}</DropdownItem>
                                                    <DropdownItem header>Licenses</DropdownItem>
                                                    <DropdownItem onClick={() => window.location.href="#/license"}>All entries</DropdownItem>
                                                    <DropdownItem onClick={() => window.location.href="#/admin/license/new"}>New entry</DropdownItem>
                                                    <DropdownItem header>Blog</DropdownItem>
                                                    <DropdownItem onClick={() => window.location.href="#/admin/blog/new"}>New
                                                        entry</DropdownItem>
                                                    <DropdownItem onClick={() => window.location.href="#/blog"}>All entries</DropdownItem>
                                                    <DropdownItem header>FAQ</DropdownItem>
                                                    <DropdownItem onClick={() => window.location.href="#/admin/faq/new"}>New
                                                        entry</DropdownItem>
                                                    <DropdownItem onClick={() => window.location.href="#/faq"}>All entries</DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        )}


                                        {(sessionStorage.getItem('role') == 'admin') && (
                                            <UncontrolledDropdown setActiveFromChild>
                                                <DropdownToggle tag="a" className="nav-link active" caret>
                                                    <i className="fe fe-box"></i><b>&nbsp;{this.props.lang.navAdmin}</b>
                                                </DropdownToggle>
                                                <DropdownMenu>

                                                    <DropdownItem onClick={() => window.location.href="#/admin/user"}>{this.props.lang.navUser}</DropdownItem>

                                                    <DropdownItem onClick={() => window.location.href="#/admin/admins"}>AdminUser</DropdownItem>

                                                    <DropdownItem onClick={() => window.location.href="#/admin/config"}>Configuration</DropdownItem>

                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        )}

                                    </Nav>
                                    {/*   )}*/}

                                    {/*                             {sessionStorage.getItem('bLogin') != 'true' && (
                                        <Nav className="nav nav-tabs border-0 flex-column flex-lg-row ml-auto" navbar>
                                            <NavItem>
                                                <NavLink to="/" className="nav-link active" activeClassName="active"><i
                                                    className="fe fe-home"></i> <b> {this.props.lang.navHome}</b>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink to="/login" className="nav-link active"
                                                         activeClassName="active"><i className="fe fe-box"></i>
                                                    <b>{this.props.lang.loginFormTitle}</b> </NavLink>
                                            </NavItem>
                                        </Nav>
                                    )}*/}


                                </div>
                            </div>
                        </div>
                    </div>
                </Collapse>

            </div>
        )
            ;
    }

}

export default Header;