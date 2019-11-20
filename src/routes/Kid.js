import React from 'react';
import axios from "axios";
import { Form, Input, Button, Alert, DatePicker, Radio } from 'antd';
import '../style/kid.css';
const FormItem = Form.Item;

class KidAdd extends React.Component {
    state = {
        confirmDirty: false,
        errors: '',
        alert: 'none',
        gender: 'Male'
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          values.parent_id = localStorage.user_id;
            if (!err) {
                e.preventDefault();
                axios({
                    method: 'post',
                    url: 'http://13.55.208.161:3000/kid/add',
                    data: values,
                }).then(response => {
                    this.redirectProfiles();
                }).catch(error => {
                });
            }
        });
    }

    redirectProfiles = () => {
        this.props.history.push({pathname: '/users/'+localStorage.user_id});
    }

    handleFromChange = (e) => {
      this.setState({ role: e.target.value });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

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

        const config = {
          rules: [{ type: 'object', required: true, message: 'Please select date of birth!' }],
        };

        const goBack =() => {
          this.props.history.goBack();
        }

    return (
            <div id='form-kid-add'>
                <Form onSubmit={this.handleSubmit} className="course-add-form">

                    <FormItem
                      {...formItemLayout}
                      label="Last Name"
                    >
                        {getFieldDecorator('last_name', {
                            rules: [{ required: true, message: 'Please input your kid Last Name!', whitespace: true }],
                        })(
                            <Input name = 'last_name' placeholder = 'Last Name' />
                        )}
                    </FormItem>

                    <FormItem
                      {...formItemLayout}
                      label="First Name"
                    >
                        {getFieldDecorator('first_name', {
                            rules: [{ required: true, message: 'Please input your kid First Name!', whitespace: true }],
                        })(
                            <Input name = 'first_name' placeholder = 'First Name' />
                        )}
                    </FormItem>

                    <Form.Item
                      {...formItemLayout}
                      label="Date of Birth"
                    >
                      {getFieldDecorator('dob', config)(
                        <DatePicker />
                      )}
                    </Form.Item>

                    <Form.Item
                      label="Gender"
                      {...formItemLayout}
                    >

                    {getFieldDecorator('gender', {
                        initialValue: this.state.gender,
                        rules: [{ required: true, message: 'Please select gender!', whitespace: true }],
                    })(
                      <Radio.Group buttonStyle="solid" onChange={this.handleFromChange}>
                        <Radio.Button value="male">Male</Radio.Button>
                        <Radio.Button value="female">Female</Radio.Button>
                      </Radio.Group>
                    )}

                    </Form.Item>

                    <Alert message={this.state.errors} type="error" showIcon style={{ display: this.state.alert}} />

                    <FormItem className="buttons-container">
                        <Button className="cancel-btn" onClick={() => goBack()} type="primary">Cancel</Button>
                        <Button type="primary" htmlType="submit" className="course-add-btn">Add</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

const WrappedRegister= Form.create()(KidAdd);

export default WrappedRegister;
