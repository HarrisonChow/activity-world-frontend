import React from 'react';
import axios from "axios";
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

export default class UsersComment extends React.Component {

    handleReset = () => {
      this.props.comprops.form.resetFields();
    };

    commentSubmit = (e) => {
      e.preventDefault();
      this.props.comprops.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            e.preventDefault();
            delete values.rate;
            values.parent_id = localStorage.user_id;
            values.course_id = this.props.comprops.match.params.id;

            axios({
                method: 'post',
                url: 'http://13.55.208.161:3000/comments/add',
                data: values,
            }).then(response => {
                this.handleReset();
                this.props.getAllUsersComments();
            }).catch(error => {
            });
        }
      });
    }
    render() {
        const { getFieldDecorator } = this.props.comprops.form;
        return (
          <Form onSubmit={this.commentSubmit}>
            <FormItem
                label="Comments"
            >
                {getFieldDecorator('comment')(
                    <TextArea rows={4} name = 'comment' placeholder = 'Enter your comment here!' />
                )}
            </FormItem>
            <FormItem>
                <Button type="primary" htmlType="submit">Submit</Button>
            </FormItem>
          </Form>
        );
    }
}
