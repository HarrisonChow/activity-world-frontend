import React from "react";
import {
    BrowserRouter,
    Route,
    Switch,
} from "react-router-dom";
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Userprofile from './Userprofile';
import Users from './Users';
import UserUpdate from './UserUpdate';
import Courses from './Courses';
import Orders from './Orders';
import MyOrders from './MyOrders';
import CourseAdd from './CourseAdd';
import CourseUpdate from './CourseUpdate';
import Help from './Help';
import ContactUs from './ContactUs';
import StorageList from './StorageList';
import Layout from './Layout';
import KidAdd from './Kid';
import KidUpdate from './KidUpdate';
import Booking from './Booking';

export default () => (

        <BrowserRouter>
            <Layout>
                <Switch>
                    <Route path="/login" render={props => <Login {...props} />} />
                    <Route path="/register" render={props => <Register {...props} />} />
                    <Route path="/users/update/:id" render={props => <UserUpdate {...props} />} />
                    <Route path="/users/:id" render={props => <Userprofile {...props} />} />
                    <Route path="/users" render={props => <Users {...props} />} />
                    <Route path="/courses" render={props => <Courses {...props} />} />
                    <Route path="/course/add" render={props => <CourseAdd {...props} />} />
                    <Route path="/course/:id" render={props => <CourseUpdate {...props} />} />
                    <Route path="/bookings" render={props => <Booking {...props} />} />
                    <Route path="/storageList" render={props => <StorageList {...props} />} />
                    <Route path="/orders/:id" render={props => <MyOrders {...props} />} />
                    <Route path="/orders" render={props => <Orders {...props} />} />
                    <Route path="/kid/add" render={props => <KidAdd {...props} />} />
                    <Route path="/kid/:id" render={props => <KidUpdate {...props} />} />
                    <Route path="/help" render={props => <Help {...props} />} />
                    <Route path="/contactUs" render={props => <ContactUs {...props} />} />
                    <Route path="/" render={props => <Home {...props} />} />

                </Switch>
            </Layout>
        </BrowserRouter>

);
