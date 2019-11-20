import React from 'react';
import axios from "axios";
import '../style/courseUpdate.css';
import { Form, Input, Button, Alert, DatePicker, TimePicker, Select } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {weekdays} from "../functions/weekdays";
import {ageGroup} from "../functions/agegroup";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

function handleChange(value) {
  console.log(`selected ${value}`);
}

export default class CourseUpdateForm extends React.Component {
    state = {
        errors: '',
        alert: 'none',
    }

    checkNumber = (rule, value, callback) => {

        if (parseInt(value) == value) {
            callback();
            return;
        }
        callback('The input is not valid number!');
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.formProps.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            e.preventDefault();
            axios({
                method: 'patch',
                url: 'http://13.55.208.161:3000/courses/'+this.props.courseId,
                data: values,
            }).then(response => {
                this.props.redirectCourses();
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

    render() {
        const { getFieldDecorator } = this.props.formProps.form;
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
        const { TextArea } = Input;

        const goBack =() => {
          this.props.formProps.history.goBack();
        }
        return (
          <Form onSubmit={this.handleSubmit} className="course-update-form">
            <FormItem
              {...formItemLayout}
              label="Activity Name"
            >
                {getFieldDecorator('course_name', {
                  initialValue: this.props.data.course_name,
                  rules: [{ required: true, message: 'Please input your Activity Name!', whitespace: true }],
                })(
                  <Input name = 'course_name'/>
                )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Price"
            >
                {getFieldDecorator('price', {
                  initialValue: this.props.data.price,
                  rules: [
                  { validator: this.checkNumber },
                  { required: true, message: 'Please input your Price!'}],
                })(
                  <Input name = 'price' />
                )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Capacity"
            >
                {getFieldDecorator('capacity', {
                  initialValue: this.props.data.capacity,
                  rules: [
                    { validator: this.checkNumber },
                    { required: true, message: 'Please input your course capacity!'}
                  ],
                })(
                    <Input name = 'capacity' placeholder = 'Capacity' onChange={this.handleNumberChange}/>
                )}
            </FormItem>

            <Form.Item
              {...formItemLayout}
              label="Date range"
            >
              {getFieldDecorator('date_range', {
                initialValue:[moment(this.props.data.start_date, 'DD/MM/YY'), moment(this.props.data.end_date, 'DD/MM/YY')],
                rules: [{ type: 'array', required: true, message: 'Please select date!' }],
              })(
                <RangePicker/>
              )}
            </Form.Item>

            <FormItem
              {...formItemLayout}
              label="Repeat on"
            >
              {getFieldDecorator('repeat_on', {
                initialValue:this.props.data.repeat_on,
                rules: [
                  { required: true, message: 'Please select activity course repeat date!', type: 'array' },
                ],
              })(
                <Select
                  mode="tags"
                  placeholder="Saturday,Sunday"
                  onChange={handleChange}
                >
                  {weekdays()}
                </Select>
              )}
            </FormItem>

            <Form.Item
              label="Time range"
              {...formItemLayout}
              style={{ marginBottom: 0 }}
            >
              <Form.Item
                style={{ display: 'inline-block' }}
              >
                {getFieldDecorator('from',{
                  initialValue: moment(this.props.data.time_from, 'HH:mm'),
                  rules: [{ type: 'object', required: true, message: 'Please select time!' }],
                })(
                  <TimePicker format={'HH:mm'}/>
                )}
              </Form.Item>

              <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
                -
              </span>

              <Form.Item
                style={{ display: 'inline-block' }}
              >
                {getFieldDecorator('to', {
                  initialValue: moment(this.props.data.time_to, 'HH:mm'),
                  rules: [{ type: 'object', required: true, message: 'Please select time!' }],
                })(
                  <TimePicker format={'HH:mm'}/>
                )}
              </Form.Item>

            </Form.Item>

            <FormItem
              {...formItemLayout}
              label="Age group"
            >
              {getFieldDecorator('age_group', {
                initialValue: this.props.data.age_group,
                rules: [
                  { required: true, message: 'Please select course age group!', type: 'array' },
                ],
              })(
                <Select
                  mode="tags"
                  placeholder="1-3"
                  onChange={handleChange}
                >
                  {ageGroup()}
                </Select>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Location"
            >
                {getFieldDecorator('location', {
                  initialValue: this.props.data.location,
                  rules: [{ required: true, message: 'Please input course location!', whitespace: true }],
                })(
                  <Input name = 'location' placeholder = 'Location' />
                )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Course content"
            >
                {getFieldDecorator('course_content', {
                  initialValue: this.props.data.course_content,
                  rules: [{ required: true, message: 'Please input course content!', whitespace: true }],
                })(
                  <TextArea rows={4} name = 'course_content' placeholder = 'course content' />
                )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Discount"
            >
                {getFieldDecorator('discount', {
                  initialValue: this.props.data.discount,
                  rules: [
                    { validator: this.checkNumber },
                    { required: true, message: 'Please input your Discount!'}
                  ],
                })(
                  <Input name = 'discount' placeholder = 'Discount' />
                )}
            </FormItem>

            <Form.Item
              {...formItemLayout}
              label="Discount date"
            >
              {this.props.data.discount_from ?

                getFieldDecorator('discount_date_range', {
                initialValue:[moment(this.props.data.discount_from, 'DD/MM/YY'), moment(this.props.data.discount_to, 'DD/MM/YY')],
                rules: [{ type: 'array', message: 'Please select discount date range!' }]
              })(
                <RangePicker />
              ) :
                getFieldDecorator('discount_date_range', {
                rules: [{ type: 'array', message: 'Please select discount date range!' }]
              })(
                <RangePicker />
              )}
            </Form.Item>

            <Alert message={this.state.errors} type="error" showIcon style={{ display: this.state.alert}} />

            <FormItem className="buttons-container">
                <Button className="cancel-btn" onClick={() => goBack()} type="primary">Cancel</Button>
                <Button type="primary" htmlType="submit" className="update-btn">Update</Button>
            </FormItem>
        </Form>
        );
    }
}
