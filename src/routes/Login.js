import React from 'react';
import axios from "axios";
import '../style/login.css';
import { Form, Icon, Input, Button, Alert } from 'antd';
const queryString = require('query-string');
const FormItem = Form.Item;

class Login extends React.Component {
    state = {
        errors: '',
        alert: 'none',
        success: 'none',
        logout: 'none',
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                axios({
                  method: 'post',
                  url: 'http://13.55.208.161:3000/auth/login',
                  data: values,
                  withCredentials: true,
                }).then(response => {
                    localStorage.user_id = response.data.id;
                    localStorage.user_role = response.data.role;
                    this.redirectUser();
                }).catch((error) => {
                    this.setState({
                        errors:error.response.data.message,
                        alert: 'block'
                    });

                    setTimeout(function(){
                        this.setState({alert:'none'});
                    }.bind(this),5000);

                });
            }
        });
    }
    redirectUser = () => {
        this.props.history.push('/');
    }

    componentDidMount(){
        if (queryString.parse(this.props.location.search).success) {
            this.setState({
                success: 'block'
            });
            setTimeout(function(){
                this.setState({success:'none'});
            }.bind(this),5000);
        } else if (queryString.parse(this.props.location.search).logout) {
            this.setState({
                logout: 'block'
            });
            setTimeout(function(){
                this.setState({logout:'none'});
            }.bind(this),5000);
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div id="form-login">
                <div className="login-header"><Icon type="rocket" /> Activities World</div>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('email', {
                            rules: [{ required: true, message: 'Please input your email!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: '#041e42' }} />} placeholder="Email" />
                        )}
                    </FormItem>

                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: '#041e42' }} />} type="password" placeholder="Password" />
                        )}
                    </FormItem>

                    <Alert message={this.state.errors} type="error" showIcon style={{ display: this.state.alert}} />
                    <Alert message="Registration successful!" type="success" showIcon  style={{ display: this.state.success}}/>
                    <Alert message="Logout successful!" type="success" showIcon  style={{ display: this.state.logout}}/>


                    <FormItem>
                        <a className="login-form-forgot" href="">Forgot password</a>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or <a href="/register">register now!</a>
                    </FormItem>
                </Form>

            </div>
        );
    }
}

const WrappedLogin = Form.create()(Login);

export default WrappedLogin;
