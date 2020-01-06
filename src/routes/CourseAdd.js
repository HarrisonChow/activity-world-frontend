import React from 'react';
import axios from "axios";
import { Form, Input, Button, Alert, DatePicker, TimePicker, Select } from 'antd';
import moment from 'moment';
import {weekdays} from "../functions/weekdays";
import {ageGroup} from "../functions/agegroup";
import '../style/courseadd.css';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class CourseAdd extends React.Component {
    state = {
        confirmDirty: false,
        errors: '',
        alert: 'none',
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          values.user_id = localStorage.user_id;
          values.remaining_spot = values.capacity;
            if (!err) {
                e.preventDefault();
                axios({
                    method: 'post',
                    url: 'http://13.55.208.161:3000/course/add',
                    data: values,
                }).then(response => {
                    this.redirectCourses();
                }).catch(error => {
                });
            }
        });
    }

    redirectCourses = () => {
        this.props.history.push({pathname: '/courses'});
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

        const rangeConfig = {
          rules: [{ type: 'array', required: true, message: 'Please select date!' }],
        };
        const config = {
          rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        };
        const { TextArea } = Input;

    return (
            <div id='form-course-add'>
                <Form onSubmit={this.handleSubmit} className="course-add-form">

                    <FormItem
                      {...formItemLayout}
                      label="Course name"
                    >
                        {getFieldDecorator('course_name', {
                            rules: [{ required: true, message: 'Please input your Course Name!', whitespace: true }],
                        })(
                            <Input name = 'course_name' placeholder = 'Course Name' />
                        )}
                    </FormItem>

                    <Form.Item
                      {...formItemLayout}
                      label="Date range"
                    >
                      {getFieldDecorator('date_range', rangeConfig)(
                        <RangePicker />
                      )}
                    </Form.Item>

                    <FormItem
                      {...formItemLayout}
                      label="Repeat on"
                    >
                      {getFieldDecorator('repeat_on', {
                        rules: [
                          { required: true, message: 'Please select activity course repeat date!', type: 'array' },
                        ],
                      })(
                        <Select
                          mode="tags"
                          placeholder="Saturday,Sunday"
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
                          initialValue: moment('09:00', 'HH:mm'), config
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
                          initialValue: moment('12:00', 'HH:mm'), config
                        })(
                          <TimePicker format={'HH:mm'}/>
                        )}
                      </Form.Item>

                    </Form.Item>

                    <FormItem
                        {...formItemLayout}
                        label="Price"
                    >
                        {getFieldDecorator('price', {
                            rules: [{ required: true, message: 'Please input your the fee!', whitespace: true }],
                        })(
                            <Input name = 'price' placeholder = 'price' />
                        )}
                    </FormItem>

                    <FormItem
                      {...formItemLayout}
                      label="Age group"
                    >
                      {getFieldDecorator('age_group', {
                        rules: [
                          { required: true, message: 'Please select course age group!', type: 'array' },
                        ],
                      })(
                        <Select
                          mode="tags"
                          placeholder="1-3"
                        >
                          {ageGroup()}
                        </Select>
                      )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="Capacity"
                    >
                        {getFieldDecorator('capacity', {
                            rules: [{ required: true, message: 'Please input course capacity!', whitespace: true }],
                        })(
                            <Input name = 'capacity' placeholder = 'Capacity' />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="Location"
                    >
                        {getFieldDecorator('location', {
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
                            rules: [{ message: 'Please input your Discount!', whitespace: true }],
                        })(
                            <Input name = 'discount' placeholder = 'Discount' />
                        )}
                    </FormItem>

                    <Form.Item
                      {...formItemLayout}
                      label="Discount date"
                    >
                      {getFieldDecorator('discount_date_range', {
                        rules: [{ type: 'array', message: 'Please select discount date range!' }]
                      })(
                        <RangePicker />
                      )}
                    </Form.Item>

                    <Alert message={this.state.errors} type="error" showIcon style={{ display: this.state.alert}} />

                    <FormItem>
                        <Button type="primary" htmlType="submit" className="course-add-btn">Add</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

const WrappedRegister= Form.create()(CourseAdd);

export default WrappedRegister;
