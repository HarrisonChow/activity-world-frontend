import React from 'react';
import axios from "axios";
import '../style/courseUpdate.css';
import { Form, Button, Card, Tag } from 'antd';
import Kidlist from './Kidlist';
import Comment from './Comment';
import Rating from './Rating';
import CommentList from './CommentList';
import CourseUpdateForm from './CourseUpdateForm';

class CourseUpdate extends React.Component {
      _isMounted = false;

      state = {
          confirmDirty: false,
          booking: false,
          data: [],
          role: localStorage.user_role,
          selectedKid:[],
          currentRate: [],
          averageRate: 0,
          rateStatus: false,
          commentStatus: false,
          submitButton: false,
          courseComment: [],
      }

      updateRateStatus = (e) => {
        var value = {
          rate_status: true
        }
        axios({
            method: 'patch',
            url: 'http://13.55.208.161:3000/bookings/'+this.state.data.id,
            data: value,
            withCredentials: true,
            params: {
              user_role: localStorage.user_role
            }
        }).then(response => {
            this.setState({ rateStatus: false })
        }).catch((error) => {
        });
      }

      rateSubmit = (e) => {
        var value = {
          rate: parseInt(e, 10)
        }
        axios({
            method: 'patch',
            url: 'http://13.55.208.161:3000/courses/'+this.props.match.params.id,
            data: value,
        }).then(response => {
          var newRate = this.state.currentRate.concat(e);
          this.setState({ currentRate: newRate })
          this.averageRating();
          this.updateRateStatus();
        }).catch(error => {
        });
      }

      averageRating = () => {
        var rateArray = this.state.currentRate;
        var sum = 0;
        for( var i = 0; i < rateArray.length; i++ ) {
            sum += parseInt( rateArray[i], 10 );
        }
        var avg = sum/rateArray.length;
        this.setState({
            averageRate: avg
        });

      }

      checkingRatingAndComment = (id) => {
        id = parseInt(id, 10);
        axios({
          method: 'get',
          url: 'http://13.55.208.161:3000/bookings/'+id,
          withCredentials: true,
        }).then(response => {
          this.setState({
            rateStatus:true,
            commentStatus:true
          });
        }).catch((error) => {
        });
      }

      getAllComments = () => {
        axios({
          method: 'get',
          url: 'http://13.55.208.161:3000/comments/'+this.props.match.params.id,
          withCredentials: true,
        }).then(response => {
            this.setState({
              courseComment: response.data,
            });
        }).catch((error) => {

        });
      }

      redirectCourses = () => {
        this.props.history.push({pathname: '/courses', search: '?success=true'});
      }

      readyBooking = () => {
        if (localStorage.user_id) {
          this.setState({
            booking: !this.state.booking
          });
        } else {
          this.props.history.push({pathname: '/login'});
        }
      }

      selectKid = (kid) => {
        if (kid.length > 0) {
          this.setState({
            selectedKid: kid,
            submitButton: !this.state.submitButton
          });
        } else {
          this.setState({
            selectedKid: [],
            submitButton: !this.state.submitButton
          });
        }
      }

      submitBooking = () => {
        var value={};
        var values=[];
        var course_id = this.state.course_id;
        if (this.state.selectedKid.length > 0) {
          this.state.selectedKid.forEach(function(kid) {
            value.parent_id = parseInt(localStorage.user_id, 10);
            value.course_id = parseInt(course_id, 10);
            value.kid_id = kid.id;
            values.push(value);
            value={};
          })

          axios({
              method: 'post',
              url: 'http://13.55.208.161:3000/booking/add',
              data: values,
          }).then(response => {
            this.redirectCourses();
          }).catch((error) => {
          });
        } else {

        }

      }

      componentDidMount() {
        this._isMounted = true;
        this.getAllComments();
          axios({
            method: 'get',
            url: 'http://13.55.208.161:3000/courses/'+this.props.match.params.id,
            withCredentials: true,
          }).then(response => {
              var currentRate = response.data.rate ? response.data.rate : [5];

              this.setState({
                data: response.data,
                course_id: this.props.match.params.id,
                currentRate: currentRate,
              });

              this.averageRating();
              this.checkingRatingAndComment(this.state.data.id);

          }).catch((error) => {

          });
      }
      componentWillUnmount() {
        this._isMounted = false;
      }

      render() {

      return (
          <div id='form-course-update'>
              { this.state.role ==='admin' || this.state.role ==='officer'  ? (
                <CourseUpdateForm
                  formProps={this.props}
                  formProp={this.props.form}
                  data={this.state.data}
                  error={this.state.error}
                  alert={this.state.alert}
                  courseId={this.props.match.params.id}
                  redirectCourses={this.redirectCourses}
                />
              ) : (
                <Card title={this.state.data.course_name} extra={
                    <div>
                      {this.state.data.remaining_spot === 0 ?
                      <Tag className="full-tag" color="#f50">Full</Tag>
                      :
                      <Button type="primary" className="add-btn" onClick={this.readyBooking}>
                          {this.state.booking ? 'Cancel' : 'Book Now'}
                      </Button>
                      }
                      { this.state.booking && this.state.submitButton ?
                      <Button type="primary" className="add-btn" onClick={this.submitBooking}>
                          Submit
                      </Button>
                      : this.state.booking ?
                      <Button type="primary" disabled className="add-btn">
                          Submit
                      </Button>
                      :
                      null
                      }
                    </div>
                }>

                  {this.state.booking
                    &&
                  <Kidlist
                    booking={this.state.booking}
                    selectCourse={this.state.data.id}
                    selectKid={this.selectKid}
                  />}

                  <div className="additional">
                    <p>
                      <label>Course Content: </label>
                      {this.state.data.course_content}
                    </p>
                    <p>
                      <label>Price: </label>
                      ${this.state.data.price}
                    </p>
                    <p>
                      <label>Remaining Spot: </label>
                      {this.state.data.remaining_spot}/{this.state.data.capacity}
                    </p>
                    <p>
                      <label>Location: </label>
                      {this.state.data.location}
                    </p>
                    <p>
                      <label>Repeat On Every: </label>
                      {this.state.data.repeat_on}
                    </p>
                    <p>
                      <label>Semester: </label>
                      From {this.state.data.start_date} to {this.state.data.end_date}
                    </p>
                    <p>
                      <label>Session Length: </label>
                      {this.state.data.time_from} - {this.state.data.time_to}
                    </p>
                    <p>
                      <label>Age: </label>
                      {this.state.data.age_group}
                    </p>
                    <Rating
                      rateStatus={this.state.rateStatus}
                      currentRate={this.state.currentRate}
                      averageRate={this.state.averageRate}
                      rateSubmit={this.rateSubmit}
                      formProp={this.props.form}
                    />

                    <CommentList
                      courseId={this.props.match.params.id}
                      comments={this.state.courseComment}
                    />

                    {this.state.commentStatus
                      &&
                    <Comment
                      comprops={this.props}
                      getAllComments={this.getAllComments}
                    /> }

                  </div>

                </Card>
              )}
          </div>
      );
    }
}


const WrappedRegister= Form.create()(CourseUpdate);

export default WrappedRegister;
