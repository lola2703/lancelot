import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";

class Footer extends React.Component {
  render() {
    return (
      <div className="footer bg-bookdriver">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-6 col-md-3">
                  <ul className="list-unstyled mb-0">
                    <li>
                      <Link to="/imprint" className="text-black-50">
                        {this.props.lang.imprint}
                      </Link>
                    </li>
                    <li>
                      <Link to="/privacy" className="text-black-50">
                        {this.props.lang.privacy}
                      </Link>
                    </li>
                    <li>
                      <Link to="/aboutus" className="text-black-50">
                        {this.props.lang.aboutUs}
                      </Link>
                    </li>
                  </ul>
                </div>
                {/*
                                <div className="col-6 col-md-3">
                                    <ul className="list-unstyled mb-0">
                                        <li><Link to="/facebook" className="text-black-50"><i className="fe fe-facebook"></i> facebook</Link></li>
                                        <li><Link to="/twitter" className="text-black-50"><i className="fe fe-twitter"></i> twitter</Link></li>
                                    </ul>
                                </div>*/}
                <div className="col-6 col-md-3">
                  <ul className="list-unstyled mb-0">
                    <li>
                      <Link to="/lang/de" className="text-black-50">
                        {this.props.lang.german}
                      </Link>
                    </li>
                    <li>
                      <Link to="/lang/en" className="text-black-50">
                        {this.props.lang.englisch}
                      </Link>
                    </li>
                    <li>
                      <Link to="/lang/fr" className="text-black-50">
                        {this.props.lang.france}
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="col-6 col-md-3"></div>
                <div className="col-6 col-md-3">
                  <a href="https://www.facebook.com/Lancelot.education">
                    <img
                      src={require("./assets/fb.png")}
                      width="50px"
                      height="50px"
                      alt="Facebook Icon"
                    />
                  </a>
                  <a href="https://www.instagram.com/lanceloteducation/">
                    <img
                      src={require("./assets/insta.png")}
                      width="50px"
                      height="50px"
                      alt="Instagram Icon"
                    />
                  </a>
                  <a href="#">
                    <img
                      src={require("./assets/twitter.png")}
                      width="50px"
                      height="50px"
                      alt="Twitter Icon"
                    />
                  </a>
                  <a href="#">
                    <img
                      src={require("./assets/youtube.png")}
                      width="50px"
                      height="50px"
                      alt="Youtube Icon"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
