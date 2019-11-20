import React from 'react';
import { Row, Button, Spin } from 'antd';
import CoursesItem from './CoursesItem';

import '../style/courses.css';


export default class CoursesList extends React.Component {

    render() {
        const {loadingMore, showLoadingMore } = this.props.courseData;
        const loadMore = showLoadingMore ? (
            <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
                {loadingMore && <Spin />}
                {!loadingMore && <Button onClick={this.props.onLoadMore}>loading more</Button>}
            </div>
        ) : null;

        return (
            <div className="CoursesContainer">
              <Row>
                {
                  this.props.courseData.data.map((course, i) => {
                   return (<CoursesItem key={i} course={course} />)
                  })
                }
              </Row>
              {loadMore}
            </div>
        );
    }
}
