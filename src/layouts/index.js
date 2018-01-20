import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import Alert from '../components/alert.js';
import Media from 'react-media';
import hackpic from './hackdavis.jpg';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import $ from 'jquery';
//if(typeof window !== 'undefined'){ require('bootstrap/dist/js/bootstrap.min.js') }
import Collapse from '../vendor/collapse';
import Dropdown from '../vendor/dropdown';

if (typeof window !== `undefined`) {
  Collapse($);
  Dropdown($);
}

import './index.css';
import './nav.css';

const Header = () => {
  function collapseNav() {
    $('#navbarSupportedContent').collapse('hide');
  }
  return (
    <nav
      id="nav"
      className="navbar navbar-expand-lg navbar-dark justify-content-between"
    >
      <h1 id="nav-title" className="navbar-brand">
        <Link onClick={collapseNav} to="/">
          HACK<strong style={{ fontFamily: 'FuturaStd-Heavy' }}>DAVIS</strong>{' '}
          LIVE
        </Link>
      </h1>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div
        className="collapse navbar-collapse justify-content-end"
        id="navbarSupportedContent"
      >
        <div className="navbar-nav justify-content-center">
          <Link
            exact
            to="/"
            onClick={collapseNav}
            activeClassName="active"
            className="nav-item nav-link"
          >
            {' '}
            Home{' '}
          </Link>
          <Link
            exact
            to="/map"
            onClick={collapseNav}
            activeClassName="active"
            className="nav-item nav-link"
          >
            {' '}
            Map{' '}
          </Link>
          <Link
            exact
            to="/API"
            onClick={collapseNav}
            activeClassName="active"
            className="nav-item nav-link"
          >
            APIs
          </Link>
          <Link
            exact
            to="/hardware"
            onClick={collapseNav}
            activeClassName="active"
            className="nav-item nav-link"
          >
            {' '}
            Hardware{' '}
          </Link>
          <a
            target="_blank"
            href="http://help.hackdavis.io"
            className="nav-item nav-link"
          >
            {' '}
            Mentors{' '}
          </a>
          <a
            target="_blank"
            href="https://hackdavis2018.devpost.com/"
            className="nav-item nav-link"
          >
            {' '}
            Devpost{' '}
          </a>
          <a
            target="_blank"
            href="https://l.messenger.com/l.php?u=https%3A%2F%2Fhackdavis.us13.list-manage.com%2Ftrack%2Fclick%3Fu%3D55e261b8d4dc713bb62b51557%26id%3D42d0b4c2d2%26e%3D707cac4d8a&h=ATNx1LO6G4BEiSmp7Zw41pDjrDr7M4SBt9OeZClgmTMl6SzRQ4TdoxeBXkMDUprRoHyW7r4-BxhsbgN6CYL0F2SfYaEepyVdIWYtm2zhTamKZeXieK6E-WxyskZGj6ENipFIPhh8NMt13aRX"
            className="nav-item nav-link"
          >
            {' '}
            Slack
            <i className="fa fa-slack" aria-hidden="true" />{' '}
          </a>
        </div>
      </div>
    </nav>
  );
};

  function authorizeNotification() {
    Notification.requestPermission(function(perm) {
    });
  }

function callNotification(notiText)
{
  if (localStorage['lastAlert'] != notiText) {
        var notification = new Notification("HackDavis 2018", {
        dir: "auto",
        lang: "",
        body: notiText,
        tag: "hackdavis",
        icon: hackpic
        }); 

    localStorage['lastAlert'] = notiText;
  }        

}

class TemplateWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      children: props.children,
    };
    this.checkGist = this.checkGist.bind(this);
  }

  checkGist() {
    console.log("Accesed:");

    fetch('http://getschedulehelper.com/alerts.json', { cache: 'reload' }).then(
      response => {
        response.json().then(alert => {

          callNotification(alert.text);

          this.setState({
            children: this.state.children,
            alert: alert,
          });
        });
      },
      error => {
        console.error(error);
      }
    );
  }
  componentDidMount() {
    authorizeNotification();
    if (!this.timer) this.timer = setInterval(this.checkGist, 60000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }
  render() {
    return (
      <div>
        <Helmet
          title="HackDavis Live 2018"
          meta={[
            { name: 'description', content: 'HackDavis is happening now!' },
            { name: 'keywords', content: 'hackathon, davis' },
          ]}
        />
        <Header />
        {this.state.alert && this.state.alert.text !== '' ? (
          <Alert
            text={this.state.alert.text}
            important={this.state.alert.important}
          />
        ) : null}
        <div
          style={{
            margin: '0 auto',
          }}
        >
          {this.state.children()}
        </div>
      </div>
    );
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;
