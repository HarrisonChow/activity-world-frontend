import React from 'react';
import axios from "axios";
import { Form, Input, Button, DatePicker, Radio } from 'antd';
import moment from 'moment';
import '../style/kid.css';

const FormItem = Form.Item;


class KidUpdate extends React.Component {

    state = {
        confirmDirty: false,
        errors: '',
        alert: 'none',
        success: 'none',
        data: [],
        role: localStorage.user_role,
    }
    updateSuccess = () => {
        this.props.history.push({pathname: '/users/'+localStorage.user_id, search: '?success=true'});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            e.preventDefault();
            axios({
                method: 'patch',
                url: 'http://13.55.208.161:3000/kids/'+this.props.match.params.id,
                data: values,
            }).then(response => {
                this.updateSuccess();
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
        url: 'http://13.55.208.161:3000/kids/'+this.props.match.params.id,
        withCredentials: true,
      }).then(response => {
          this.setState({
            data: response.data[0],
          });
      }).catch((error) => {

      });
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
      const goBack =() => {
        this.props.history.goBack();
      }

    return (
        <div id='form-kid-update'>

            <Form onSubmit={this.handleSubmit} className="course-update-form">
              <FormItem
                {...formItemLayout}
                label="Last Name"
              >
                  {getFieldDecorator('last_name', {
                      initialValue: this.state.data.last_name,
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
                      initialValue: this.state.data.first_name,
                      rules: [{ required: true, message: 'Please input your kid First Name!', whitespace: true }],
                  })(
                      <Input name = 'first_name' placeholder = 'First Name' />
                  )}
              </FormItem>

              <Form.Item
                {...formItemLayout}
                label="Date of Birth"
              >
                {getFieldDecorator('dob', {
                  initialValue: moment( this.state.data.dob ),
                  rules: [{ type: 'object', required: true, message: 'Please select date of birth!' }]
                })(
                  <DatePicker format={ 'DD-MM-YYYY'}/>
                )}
              </Form.Item>

              <Form.Item
                label="Gender"
                {...formItemLayout}
              >

              {getFieldDecorator('gender', {
                  initialValue: this.state.data.gender,
                  rules: [{ required: true, message: 'Please select gender!', whitespace: true }],
              })(
                <Radio.Group buttonStyle="solid" onChange={this.handleFromChange}>
                  <Radio.Button value="male">Male</Radio.Button>
                  <Radio.Button value="female">Female</Radio.Button>
                </Radio.Group>
              )}

              </Form.Item>

              <FormItem className="buttons-container">
                  <Button className="cancel-btn" onClick={() => goBack()} type="primary">Cancel</Button>
                  <Button type="primary" htmlType="submit" className="update-btn">Update</Button>
              </FormItem>
          </Form>
        </div>
    );
  }
}



const WrappedRegister= Form.create()(KidUpdate);

export default WrappedRegister;
