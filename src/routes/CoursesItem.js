import React from 'react';
import { Col, Card, Icon } from 'antd';
import '../style/coursesItem.css';

const { Meta } = Card;

export default class CoursesItem extends React.Component {

    constuctor() {
      this.redirectDetail = this.redirectDetail.bind(this);
    }

    redirectDetail(id) {
      window.location.pathname = '/course/'+id;
    }

    render() {

    return (
        <Col sm={24} md={12} lg={8} xl={6}>
          <Card
            hoverable
            cover={
              <img
                alt="example"
                src="https://via.placeholder.com/468x230"
                onClick={() => this.redirectDetail(this.props.course.id)}
              />
            }
            actions={[<Icon type="heart" onClick={() => {alert("Hello from here")}}/>, <Icon type="book" />]}

          >
            <Meta
              title={this.props.course.course_name}
              description={this.props.course.location}
            />
          </Card>
        </Col>
    );
  }
}
