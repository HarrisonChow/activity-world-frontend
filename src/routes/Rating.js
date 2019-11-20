import React from 'react';
import { Form, Rate } from 'antd';

export default class Rating extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.formProp;
        return (
          <Form>
            {this.props.rateStatus ?
            <Form.Item>
              {getFieldDecorator('rate', {
                initialValue: Math.round(this.props.averageRate*2)/2,
              })(<Rate allowHalf allowClear={false} onChange={this.props.rateSubmit}/>)}
              <span className="ant-form-text">{Math.round(this.props.averageRate * 100) / 100}</span>
            </Form.Item>
            :
            <Form.Item>
              {getFieldDecorator('rate', {
                initialValue: Math.round(this.props.averageRate*2)/2,
              })(<Rate allowHalf disabled/>)}
              <span className="ant-form-text">{Math.round(this.props.averageRate * 100) / 100}</span>
            </Form.Item>
            }
          </Form>
        );
    }
}
