import React from 'react';
import axios from "axios";
import { Menu, Icon,Layout } from 'antd';
import '../style/menu.css';
import { Link } from 'react-router-dom';
import {logout} from "../functions/logout";
import logo from '../images/logo.png';

const { Header } = Layout;


export default class MenuWeb extends React.Component  {
    state = {
        viewType: this.props.currentRole,
    };

    handleClick = e => {
        console.log('click ', e);
    };

    logingOut = () => {
        this.setState({
            viewType: logout(),
        });
    }
    componentWillUpdate(prevProps, prevState) {
        if (localStorage.user_role !== prevState.viewType) {
            this.setState({
                viewType: localStorage.user_role,
            });
        }
    }

    render() {
        return (
          <Header className="MenuWeb">
            <div>
              <img src={logo} alt="logo" className="logo" />
            </div>
            <Menu onClick={this.handleClick} mode="horizontal">

              <Menu.Item key="1">
                  <Link to={{pathname: '/'}}>
                      <span>Home</span>
                  </Link>
              </Menu.Item>

              { this.state.viewType ==='admin'  ? (
                <Menu.Item key="2">
                    <Link to={{pathname: '/courses/'}}>
                        <span>Course Admin</span>
                    </Link>
                </Menu.Item>
              ) : this.state.viewType ==='client' ? (
                <Menu.Item key="2">
                    <Link to={{pathname: '/courses/'}}>
                        <span>All Courses</span>
                    </Link>
                </Menu.Item>
              ) : this.state.viewType ==='officer' ? (
                <Menu.Item key="2">
                    <Link to={{pathname: '/courses/'}}>
                        <span>Manage My Courses</span>
                    </Link>
                </Menu.Item>
              ) : null
              }

              { this.state.viewType ==='admin'  ? (
                <Menu.Item key="3">
                    <Link to={{pathname: '/bookings/'}}>
                        <span>Bookings Admin</span>
                    </Link>
                </Menu.Item>
              ) : this.state.viewType ==='client' ? (
                <Menu.Item key="3">
                    <Link to={{pathname: '/bookings/'}}>
                        <span>My Bookings</span>
                    </Link>
                </Menu.Item>
              ) : this.state.viewType ==='officer' ? (
                <Menu.Item key="3">
                    <Link to={{pathname: '/bookings/'}}>
                        <span>Manage Bookings</span>
                    </Link>
                </Menu.Item>
              ) : null
              }

              { this.state.viewType ==='admin'  ? (
                <Menu.Item key="4">
                    <Link to={{pathname: '/users/'}}>
                        <span>Users Admin</span>
                    </Link>
                </Menu.Item>
              ) : null }

              { typeof this.state.viewType !=='undefined' ? (
                  <Menu.Item key="17">
                      <Link to={{pathname: '/users/'+localStorage.user_id}}>
                          <span>My Profile</span>
                      </Link>
                  </Menu.Item>
              ) : null }

              <Menu.Item key="18">
                  <Link to={{pathname: '/help'}}>
                      <span>Help</span>
                  </Link>
              </Menu.Item>
              <Menu.Item key="19">
                  <Link to={{pathname: '/contactUs'}}>
                      <span>Contact Us</span>
                  </Link>
              </Menu.Item>

              { typeof this.state.viewType !=='undefined' ? (
                  <Menu.Item key="20" style={{float: 'right'}}>
                      <Link to={{pathname: '/login', search: '?logout=true'}} onClick={this.logingOut}>
                          <Icon type="logout" />
                          <span>Log Out</span>
                      </Link>
                  </Menu.Item>
              ) : (
                  <Menu.Item key="20" style={{float: 'right'}}>
                      <Link to={{pathname: '/login'}}>
                          <Icon type="login" />
                          <span>Log In</span>
                      </Link>
                  </Menu.Item>
              )}
            </Menu>
          </Header>
        );
    }
}
