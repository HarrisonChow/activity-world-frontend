import React from 'react';
import axios from "axios";
import '../style/userUpdate.css';
import { Form, Input, Button, Alert, Select } from 'antd';
import {allCategory} from "../functions/category";

const FormItem = Form.Item;

class UserUpdate extends React.Component {
    state = {
        confirmDirty: false,
        errors: '',
        alert: 'none',
        data: [],
        role: localStorage.user_role,
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              e.preventDefault();
              if (values.category) {
                values.category = values.category.join(', ');
              }
              axios({
                method: 'patch',
                url: 'http://13.55.208.161:3000/users/'+this.props.match.params.id,
                data: values,
              }).then(response => {
                  this.redirectUser();
              }).catch(error => {
                  this.setState({
                      errors: error.response.data.message,
                      alert: 'block'
                  });

                  setTimeout(function(){
                      this.setState({alert:'none'});
                  }.bind(this),5000);
              });
          }
        });
    }

    componentWillMount() {
        axios({
          method: 'get',
          url: 'http://13.55.208.161:3000/users/'+this.props.match.params.id,
          withCredentials: true,
        }).then(response => {
            if (response.data.category) {
              response.data.category = response.data.category.split(', ');
            }


            this.setState({
              data: response.data,
            });
        }).catch((error) => {

        });
    }



    redirectUser = () => {
        this.props.history.push({pathname: '/users/'+localStorage.user_id});
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
        const goBack =() => {
          this.props.history.goBack();
        }
        return (
            <div>
                <div id='form-update'>
                    <Form onSubmit={this.handleSubmit} className="update-form">

                      <FormItem
                        {...formItemLayout}
                        label="Email"
                      >
                        {getFieldDecorator('email', {
                          initialValue: this.state.data.email,
                        })(
                          <Input name = 'email' placeholder = 'Email' disabled/>
                        )}
                      </FormItem>

                      { this.state.role ==='officer'  ? (
                        <FormItem
                          {...formItemLayout}
                          label="Business Name"
                        >
                          {getFieldDecorator('business_name', {
                            initialValue: this.state.data.business_name,
                            rules: [{ required: true, message: 'Please input your Business Name!', whitespace: true }],
                          })(
                            <Input name = 'business_name' placeholder = 'Business Name' />
                          )}
                        </FormItem>
                      ) : null }

                      { this.state.role ==='officer'  ? (
                        <FormItem
                          {...formItemLayout}
                          label="Activity categories"
                        >
                          {getFieldDecorator('category', {
                            initialValue: this.state.data.category,
                            rules: [
                              { required: true, message: 'Please select activity course category!', type: 'array' },
                            ],
                          })(
                            <Select
                              mode="tags"
                              placeholder="Soccer,Basketball"
                            >
                              {allCategory}
                            </Select>
                          )}
                        </FormItem>
                      ) : null }


                      { this.state.role ==='officer'  ? (
                        <FormItem
                          {...formItemLayout}
                          label="ABN or ACN"
                        >
                          {getFieldDecorator('abn_acn', {
                              initialValue: this.state.data.abn_acn,
                            rules: [{ required: true, message: 'Please input your ABN or ACN!', whitespace: true }],
                          })(
                            <Input name = 'abn_acn' placeholder = 'ABN or ACN' />
                          )}
                        </FormItem>
                      ) : null }

                      <FormItem
                        {...formItemLayout}
                        label="Phone"
                      >
                        {getFieldDecorator('phone', {
                            initialValue: this.state.data.phone,
                          rules: [{ required: true, message: 'Please input your phone!', whitespace: true }],
                        })(
                          <Input name = 'phone' placeholder = 'Phone' />
                        )}
                      </FormItem>

                      <FormItem
                        {...formItemLayout}
                        label="Address"
                      >
                        {getFieldDecorator('address', {
                            initialValue: this.state.data.address,
                          rules: [{ required: true, message: 'Please input your address!', whitespace: true }],
                        })(
                          <Input name = 'address' placeholder = 'Address' />
                        )}
                      </FormItem>

                      <FormItem
                        {...formItemLayout}
                        label="Postcode"
                      >
                        {getFieldDecorator('postcode', {
                            initialValue: this.state.data.postcode,
                          rules: [{ required: true, message: 'Please input your postcode!', whitespace: true }],
                        })(
                          <Input name = 'postcode' placeholder = 'Postcode' />
                        )}
                      </FormItem>

                      { this.state.role ==='officer'  ? (
                        <FormItem
                          {...formItemLayout}
                          label="Description"
                        >
                          {getFieldDecorator('description', {
                              initialValue: this.state.data.description,
                            rules: [{ required: true, message: 'Please input your description!', whitespace: true }],
                          })(
                            <TextArea rows={4} name = 'description' placeholder = 'Description' />
                          )}
                        </FormItem>
                      ) : null }

                      <Alert message={this.state.errors} type="error" showIcon style={{ display: this.state.alert}} />

                      <FormItem className="buttons-container">
                        <Button className="cancel-btn" onClick={() => goBack()} type="primary">Cancel</Button>
                        <Button type="primary" htmlType="submit" className="update-btn">Update </Button>
                      </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const WrappedUserUpdate= Form.create()(UserUpdate);

export default WrappedUserUpdate;
