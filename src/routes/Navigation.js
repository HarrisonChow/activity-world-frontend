import React from 'react';
import axios from "axios";
import { Menu, Icon, Button, Badge } from 'antd';
import '../style/navigation.css';
import { Link } from 'react-router-dom';
import {logout} from "../functions/logout";

export default class Navigation extends React.Component  {
    state = {
        collapsed: true,
        viewType: this.props.currentRole,
        admin_booking_message: 0,
        popupVisible: false
    }
    toggleCollapsed = () => {
        if (this.state.collapsed) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
        this.setState(prevState => ({
            collapsed: !prevState.collapsed,
        }));
    }
    logingOut = () => {
        this.setState({
            viewType: logout(),
        });
    }

    handleOutsideClick = (e) => {
      if (this.node.contains(e.target)) {
        return;
      }
      this.toggleCollapsed();
    }

    bookingCheck = () => {
        axios({
            method: 'get',
            url: 'http://13.55.208.161:3000/bookings/check',
            withCredentials: true,
            data: {
              user_id: localStorage.user_id
            }
        }).then(response => {
            var newBookings = response.data.length;

            this.setState({
                admin_booking_message: newBookings,
            });
        }).catch((error) => {

        });
    }

    componentWillMount(){
        if (localStorage.user_role && typeof this.state.viewType !=='undefined') {
          this.setState({
              viewType: localStorage.user_role,
          });
        }
        if (localStorage.user_role === 'officer') {
            this.bookingCheck();
        }
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
            <div className="MenuMobile">
                <div className="navigation-header" ref={node => { this.node = node; }}>
                    <Button onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                        <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                    </Button>
                    {this.state.viewType ==='officer'  ? (
                        <div className="right-bar">
                            <div>
                                <Link to={{pathname: '/bookings'}}>
                                    <Badge count={this.state.admin_booking_message} overflowCount={10}>
                                        <Icon type="mail" className="booking-notice"/>
                                    </Badge>
                                </Link>
                            </div>
                        </div>

                    ) : ''}
                </div>
                <div className="nav-menu" style={{ zIndex: this.state.collapsed ===true  ? (0):(999) }}>
                    <Menu
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        theme="light"
                        inlineCollapsed={this.state.collapsed}
                        onClick = {this.toggleCollapsed}
                    >
                        <Menu.Item key="1">
                            <Link to={{pathname: '/'}}>
                                <Icon type="home" />
                                <span>Home</span>
                            </Link>
                        </Menu.Item>

                        {this.state.viewType ==='admin'  ? (
                            <Menu.Item key="2">
                                <Link to={{pathname: '/courses/'}}>
                                    <Icon type="database" />
                                    <span>Course Admin</span>
                                </Link>
                            </Menu.Item>
                        ) : this.state.viewType ==='client' ? (
                            <Menu.Item key="2">
                                <Link to={{pathname: '/courses/'}}>
                                    <Icon type="database" />
                                    <span>All Courses</span>
                                </Link>
                            </Menu.Item>
                        ) : this.state.viewType ==='officer' ? (
                            <Menu.Item key="2">
                                <Link to={{pathname: '/courses/'}}>
                                    <Icon type="database" />
                                    <span>Manage My Courses</span>
                                </Link>
                            </Menu.Item>
                        ): ('')}
                        {this.state.viewType ==='client'  ? (
                            <Menu.Item key="4">
                                <Link to={{pathname: '/bookings/'}}>
                                    <Icon type="shopping-cart" />
                                    <span>My Bookings</span>
                                </Link>
                            </Menu.Item>
                        ) : ('')}

                        {this.state.viewType ==='admin'  ? (
                            <Menu.Item key="3">
                                <Link to={{pathname: '/bookings/'}}>
                                    <Icon type="folder-open" />
                                    <span>Bookings Admin</span>
                                </Link>
                            </Menu.Item>
                        ) : this.state.viewType ==='officer' ? (
                            <Menu.Item key="3">
                                <Link to={{pathname: '/bookings/'}}>
                                    <Icon type="folder-open" />
                                    <span>Manage Bookings</span>
                                </Link>
                            </Menu.Item>
                        ):('')}
                        {this.state.viewType ==='admin'  ? (
                            <Menu.Item key="4">
                                <Link to={{pathname: '/users/'}}>
                                    <Icon type="folder-open" />
                                    <span>Users Admin</span>
                                </Link>
                            </Menu.Item>
                        ) : ('')}
                        { typeof this.state.viewType !=='undefined' ? (
                            <Menu.Item key="17">
                                <Link to={{pathname: '/users/'+localStorage.user_id}}>
                                    <Icon type="profile" />
                                    <span>My Profile</span>
                                </Link>
                            </Menu.Item>
                        ) : ('')}
                        <Menu.Item key="18">
                            <Link to={{pathname: '/help'}}>
                                <Icon type="question-circle-o" />
                                <span>Help</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="19">
                            <Link to={{pathname: '/contactUs'}}>
                                <Icon type="phone" />
                                <span>Contact Us</span>
                            </Link>
                        </Menu.Item>
                        { typeof this.state.viewType !=='undefined' ? (
                            <Menu.Item key="20">
                                <Link to={{pathname: '/login', search: '?logout=true'}} onClick={this.logingOut}>
                                    <Icon type="logout" />
                                    <span>Log Out</span>
                                </Link>
                            </Menu.Item>
                        ) : (
                            <Menu.Item key="20">
                                <Link to={{pathname: '/login'}}>
                                    <Icon type="login" />
                                    <span>Log In</span>
                                </Link>
                            </Menu.Item>
                        )}
                    </Menu>
                </div>
            </div>
        );
    }
}
