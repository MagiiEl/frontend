import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Moment from 'moment';
import autobind from 'autobind-decorator';

import muiThemeable from 'material-ui/styles/muiThemeable';
import AppBar from 'material-ui/AppBar';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import Center from './layout/Center'
import Main from './Main'
import LoginPage from './user/LoginPage'
import UserMenu from './user/UserMenu'
import SideMenu from './user/SideMenu'
import NotificationsMenu from './user/NotificationsMenu'

import { toggleSideMenu } from '../actions/userInterface'
import { tryRestoreLogin, logoutAfterTimeout, refreshLogin } from '../actions/login'
import { loadNotifications } from '../actions/notifications'

export class App extends Component {
  static propTypes = {
    // Injected by React Redux
    login: PropTypes.object,
    toggleSideMenu: PropTypes.func.isRequired,
    refreshLogin: PropTypes.func.isRequired,
    tryRestoreLogin: PropTypes.func.isRequired,
    logoutAfterTimeout: PropTypes.func.isRequired,
    loadNotifications: PropTypes.func.isRequired,

    // Injected by React Router
    children: PropTypes.node,
    // Injected by muiThemeable
    muiTheme: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.tryRestoreLogin();

    this.loginRefreshFunction = setInterval(() => {
      const { login, logoutAfterTimeout, refreshLogin } = this.props;

      if (!login) {
        return;
      }

      if (login.expires < new Date()) {
        logoutAfterTimeout();
      }

      let refreshTarget = new Moment(login.expires).subtract(5, 'minutes');
      if (refreshTarget.toDate() < new Date()) {
        refreshLogin();
      }
    }, 1000);

    this.loadNotificationsFunction = setInterval(() => {
      if (this.props.login) {
        this.props.loadNotifications()
      }
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.loginRefreshFunction);
    clearInterval(this.loadNotificationsFunction);
  }

  @autobind
  handleToggleSideMenu(event, value) {
    this.props.toggleSideMenu();
  }

  render() {
    const { children, login, url, sideMenuOpen } = this.props;

    if (!login || login.expires < new Date()) {
      if (url == '/') {
        return <Main>
          <Center style={{textAlign: 'center' }}>
            <img src="../images/logo.svg" alt="CaTUstrophy" width="200rem" height="200rem"/>
            <h1>CaTUstrophy</h1>
            <p>A platform for connecting those in need with aid relief in catastrophe regions across the world.</p>
            <RaisedButton onTouchTap={() => browserHistory.push('/login')} label="login" /> &nbsp;
            <RaisedButton onTouchTap={() => browserHistory.push('/signup')} label="sign up" />
          </Center>
        </Main>;
      }
      return <Main><LoginPage /></Main>;
    }

    let sideMenuButton = <IconButton onTouchTap={this.handleToggleSideMenu}>
      {sideMenuOpen ? <CloseIcon color="white"/> : <MenuIcon color="white"/>}
    </IconButton>;

    return (
      <div>
        <Toolbar noGutter={true} style={{zIndex: 1100, position: 'fixed', top: 0, left: 0, right: 0}}>
          <ToolbarGroup firstchild={true} >
            {sideMenuButton}
            <ToolbarTitle text="CaTUstrophy" onTouchTap={() => browserHistory.push('/')} style={{cursor: 'pointer'}} />
          </ToolbarGroup>
          <ToolbarGroup float={'right'} lastchild={true}>
              {<NotificationsMenu />}
              {<UserMenu />}
          </ToolbarGroup>
        </Toolbar>
        {<SideMenu />}
        <Main>
          {children}
        </Main>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { login, userInterface: { sideMenuOpen }} = state;
  return {
    url: ownProps.location.pathname,
    login,
    sideMenuOpen
  }
}
 
export default muiThemeable()(connect(mapStateToProps, {
  toggleSideMenu,
  tryRestoreLogin,
  refreshLogin,
  logoutAfterTimeout,
  loadNotifications
})(App))