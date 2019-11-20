import React from 'react';
import axios from "axios";
import '../style/register.css';
import { Form, Input, Checkbox, Button, Select, Alert, Radio } from 'antd';
import {allCategory} from "../functions/category";

const FormItem = Form.Item;


function handleChange(value) {
  console.log(`selected ${value}`);
}

class Register extends React.Component {
    state = {
        confirmDirty: false,
        errors: '',
        alert: 'none',
        role: 'client'
    }

    handleFromChange = (e) => {
      this.setState({ role: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              e.preventDefault();
              if (this.state.role === 'officer') {
                values.category = values.category.join(', ');
              }
              values.role = this.state.role;
              axios({
                method: 'post',
                url: 'http://13.55.208.161:3000/auth/register',
                data: values,
              }).then(response => {
                  this.redirectUser();
              }).catch(error => {
                console.log(error);
                  // this.setState({
                  //     errors: error.response.data.message,
                  //     alert: 'block'
                  // });

                  setTimeout(function(){
                      this.setState({alert:'none'});
                  }.bind(this),5000);
              });
          }
        });
    }
    redirectUser = () => {
        this.props.history.push({pathname: '/login', search: '?success=true'});
    }

    handleConfirmBlur = (e) => {
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    compareToFirstPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    }
    validateToNextPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const { TextArea } = Input;

        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        };
        const tailFormItemLayout = {
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 8,
            },
          },
        };
        return (

            <div id='form-register'>
                <Form onSubmit={this.handleSubmit} className="register-form">

                  <Form.Item
                    label="Register as"
                    {...formItemLayout}
                  >
                    <Radio.Group defaultValue="client" buttonStyle="solid" onChange={this.handleFromChange}>
                      <Radio.Button value="client">User</Radio.Button>
                      <Radio.Button value="officer">School</Radio.Button>
                    </Radio.Group>
                  </Form.Item>

                  <FormItem
                    {...formItemLayout}
                    label="Email"
                  >
                    {getFieldDecorator('email', {
                      rules: [{
                        type: 'email', message: 'The input is not valid Email!',
                      }, {
                        required: true, message: 'Please input your Email!',
                      }],
                    })(
                      <Input name = 'email' placeholder = 'Email' />
                    )}
                  </FormItem>

                  <FormItem
                    {...formItemLayout}
                    label="Password"
                  >
                    {getFieldDecorator('password', {
                      rules: [{
                        required: true, message: 'Please input your password!',
                      }, {
                        validator: this.validateToNextPassword,
                      }],
                    })(
                      <Input type="password" name = 'password' placeholder = 'Password' />
                    )}
                  </FormItem>

                  <FormItem
                    {...formItemLayout}
                    label="Confirm Password"
                  >
                    {getFieldDecorator('confirm', {
                      rules: [{
                        required: true, message: 'Please confirm your password!',
                      }, {
                        validator: this.compareToFirstPassword,
                      }],
                    })(
                      <Input placeholder = 'Confirm Password' type="password" onBlur={this.handleConfirmBlur} />
                    )}
                  </FormItem>

                  { this.state.role ==='officer'  ? (
                  <FormItem
                    {...formItemLayout}
                    label="Business Name"
                  >
                    {getFieldDecorator('business_name', {
                      rules: [{ required: true, message: 'Please input your Business Name!', whitespace: true }],
                    })(
                      <Input name = 'business_name' placeholder = 'Business Name' />
                    )}
                  </FormItem>) : ('') }
                  { this.state.role ==='officer'  ? (
                  <FormItem
                    {...formItemLayout}
                    label="Activity categories"
                  >
                    {getFieldDecorator('category', {
                      rules: [
                        { required: true, message: 'Please select activity class category!', type: 'array' },
                      ],
                    })(
                      <Select
                        mode="tags"
                        placeholder="Soccer,Basketball"
                        onChange={handleChange}
                      >
                        {allCategory}
                      </Select>
                    )}
                  </FormItem>) : ('') }
                  { this.state.role ==='officer'  ? (
                  <FormItem
                    {...formItemLayout}
                    label="ABN or ACN"
                  >
                    {getFieldDecorator('abn_acn', {
                      rules: [{ required: true, message: 'Please input your ABN or ACN!', whitespace: true }],
                    })(
                      <Input name = 'abn_acn' placeholder = 'ABN or ACN' />
                    )}
                  </FormItem>) : ('') }
                  { this.state.role ==='officer'  ? (
                  <FormItem
                    {...formItemLayout}
                    label="Phone"
                  >
                    {getFieldDecorator('phone', {
                      rules: [{ required: true, message: 'Please input your phone!', whitespace: true }],
                    })(
                      <Input name = 'phone' placeholder = 'Phone' />
                    )}
                  </FormItem>) : ('') }
                  { this.state.role ==='officer'  ? (
                  <FormItem
                    {...formItemLayout}
                    label="Address"
                  >
                    {getFieldDecorator('address', {
                      rules: [{ required: true, message: 'Please input your address!', whitespace: true }],
                    })(
                      <Input name = 'address' placeholder = 'Address' />
                    )}
                  </FormItem>) : ('') }
                  { this.state.role ==='officer'  ? (
                  <FormItem
                    {...formItemLayout}
                    label="Postcode"
                  >
                    {getFieldDecorator('postcode', {
                      rules: [{ required: true, message: 'Please input your postcode!', whitespace: true }],
                    })(
                      <Input name = 'postcode' placeholder = 'Postcode' />
                    )}
                  </FormItem>) : ('') }
                  { this.state.role ==='officer'  ? (
                  <FormItem
                    {...formItemLayout}
                    label="Description"
                  >
                    {getFieldDecorator('description', {
                      rules: [{ required: true, message: 'Please input your description!', whitespace: true }],
                    })(
                      <TextArea rows={4} name = 'description' placeholder = 'Description' />
                    )}
                  </FormItem>) : ('') }
                  { this.state.role ==='officer'  ? (
                  <FormItem {...tailFormItemLayout}>
                    {getFieldDecorator('agreement', {
                      valuePropName: 'checked',
                    })(
                      <Checkbox>I have read the <a href="">agreement</a></Checkbox>
                    )}
                  </FormItem>) : ('') }

                  <Alert message={this.state.errors} type="error" showIcon style={{ display: this.state.alert}} />

                  <FormItem>
                    <Button type="primary" htmlType="submit" className="register-btn">Register</Button>
                  </FormItem>
                </Form>

            </div>
        );
    }
}

const WrappedRegister= Form.create()(Register);

export default WrappedRegister;
