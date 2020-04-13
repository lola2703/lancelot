import React from 'react';
import ReactDOM from 'react-dom';
import {Route} from 'react-router-dom';
import Index from './pages/Index';
import Books from './pages/Books';
import Registration from './pages/Registration';
import Login from './components/Login';
import Admin from './admin/Admin';
import QuizEdit from './admin/Quiz';
import BookDetail from './pages/BookDetail';
import Requests from "./admin/Requests";
import Topics from "./pages/Topics";
import Blog from "./pages/Blog";
import AdminBlog from "./admin/AdminBlog";
import AdminFaq from "./admin/AdminFaq";
import Faq from "./pages/Faq";
import AdminLicense from "./admin/AdminLicense";
import License from "./pages/License";
import AdminUser from './admin/AdminUser';
import Messages from './pages/Messages';
import AdminConfig from './admin/AdminConfig';
import Statistic from './pages/Statistic';
import History from './pages/History';
import Classmanagement from "./pages/Classmanagement";
import StaticSite from "./components/StaticSite";


class Content extends React.Component {

    render() {
        return (
            <div id="routeContent">
                <div className="my-3 my-lg-12">
                    <div className="container">
                        <Route exact path="/" render={()=><Index lang={this.props.lang} />} />
                        <Route path="/lang/:lang" render={(props) => <Index lang={this.props.lang} changelang={true} newlang={props.match.params.lang} />} />
                        <Route path="/login" render={()=><Login lang={this.props.lang} />} />

                        <Route path="/newbooks/:query?" render={(props)=><Books newBooks={true} props={props} showLang={false} showCover={true} lang={this.props.lang} />} />
                        <Route path="/books/:query?" render={(props)=><Books props={props} showLang={false} showCover={true} lang={this.props.lang} />} />
                        <Route path="/book/:id" render={(props) => <BookDetail props={props} edit={false} lang={this.props.lang} />} />

                        <Route exact path="/topics" render={(props) => <Topics modalRead={false} admin={false} props={props} lang={this.props.lang} />} />
                        <Route exact path="/topic/:id" render={(props) => <Topics modalRead={true} modalId={props.match.params.id} admin={false} props={props} lang={this.props.lang} />} />


                        <Route path="/registration" render={()=><Registration lang={this.props.lang} />} />
                        <Route path="/logout" render={() => <Index lang={this.props.lang} logout={true} /> } />


                        <Route path="/blog" render={(props) => <Blog lang={this.props.lang} props={props} />} />
                        <Route path="/faq" render={(props) => <Faq lang={this.props.lang} props={props} />} />
                        <Route path="/license" render={(props) => <License lang={this.props.lang} props={props} />} />

                        <Route path="/admin" render={() =><Admin lang={this.props.lang} />} />
                        <Route exact path="/admin/books/:query?" render={(props) =><Books props={props} admin={true} showLang={true} showCover={true} lang={this.props.lang} />} />
                        <Route exact path="/admin/books/:id" render={(props) => <BookDetail props={props} edit={true} lang={this.props.lang} />} />
                        <Route path="/admin/books/:id/quiz" render={(props) => <QuizEdit topic={false} book={true} props={props} lang={this.props.lang} />} />
                        <Route path="/admin/requests" render={(props) => <Requests props={props} lang={this.props.lang} />} />
                        <Route exact path="/admin/topics" render={(props) => <Topics admin={true} props={props} lang={this.props.lang} />} />
                        <Route path="/admin/topics/:id/quiz" render={(props) => <QuizEdit topic={true} book={false} props={props} lang={this.props.lang} />} />

                        <Route exact path="/admin/user" render={(props) =><AdminUser props={props} listType="user" lang={this.props.lang} />} />
                        <Route exact path="/admin/admins" render={(props) =><AdminUser props={props} listType="admin" lang={this.props.lang} />} />
                        <Route exact path="/admin/config" render={(props) =><AdminConfig props={props} lang={this.props.lang} />} />


                        <Route exact path="/admin/blog/new" render={(props) =><AdminBlog props={props} delete={false} lang={this.props.lang} />} />
                        <Route exact path="/admin/blog/delete/:id" render={(props) =><AdminBlog delete={true} props={props}  lang={this.props.lang} />} />

                        <Route exact path="/admin/faq/new" render={(props) =><AdminFaq props={props}  lang={this.props.lang} />} />
                        <Route exact path="/admin/faq/edit/:id" render={(props) =><AdminFaq delete={false} edit={true} props={props}  lang={this.props.lang} />} />
                        <Route exact path="/admin/faq/delete/:id" render={(props) =><AdminFaq delete={true} props={props}  lang={this.props.lang} />} />

                        <Route exact path="/admin/license/new" render={(props) =><AdminLicense props={props}  lang={this.props.lang} />} />
                        <Route exact path="/admin/license/delete/:id" render={(props) =><AdminLicense delete={true} edit={false} props={props}  lang={this.props.lang} />} />
                        <Route exact path="/admin/license/edit/:id" render={(props) =><AdminLicense delete={false} edit={true} props={props}  lang={this.props.lang} />} />

                        <Route exact path="/messages" render={(props) =><Messages props={props}  lang={this.props.lang} />} />
                        <Route exact path="/messages/:id" render={(props) =><Messages props={props}  lang={this.props.lang} />} />

                        <Route excat path="/stat/user" render={(props) =><Statistic props={props} context="user"  lang={this.props.lang} />} />
                        <Route excat path="/history" render={(props) =><History props={props} context="user"  lang={this.props.lang} />} />

                        <Route excat path="/teacher/classes" render={(props) =><Classmanagement props={props}  lang={this.props.lang} />} />

                        <Route exact path="/forgot-password" render={(props) => <Login props={props} lang={this.props.lang} forgotpassword={true} />} />

                        <Route exact path="/imprint" render={(props) => <StaticSite props={props} lang={this.props.lang} siteKey="imprint" />} />
                        <Route exact path="/privacy" render={(props) => <StaticSite props={props} lang={this.props.lang} siteKey="privacy" />} />
                        <Route exact path="/aboutus" render={(props) => <StaticSite props={props} lang={this.props.lang} siteKey="aboutus" />} />



                    </div>
                </div>
            </div>
        );
    };
}

export default Content;