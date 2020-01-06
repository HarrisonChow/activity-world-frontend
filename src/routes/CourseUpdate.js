import React from 'react';
import axios from "axios";
import '../style/courseUpdate.css';
import { Form, Button, Card, Tag, Descriptions} from 'antd';
import Kidlist from './Kidlist';
import UsersComment from './UsersComment';
import Rating from './Rating';
import UsersCommentList from './UsersCommentList';
import CourseUpdateForm from './CourseUpdateForm';

var data = [];
var course_id = '';
var currentRate = [];
var owned = false;
var rateStatus = false;
var commentStatus = false;
var averageRate = 0;
var courseUsersComment = [];

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
          courseUsersComment: [],
          ownerData: [],
          owned: false,
          course_id: ''
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
          currentRate = this.state.currentRate.concat(e);
          this.setState({ currentRate: currentRate })
          this.averageRating();
          this.updateRateStatus();
        }).catch(error => {
        });
      }

      averageRating = () => {
        var rateArray = currentRate;
        var sum = 0;
        for( var i = 0; i < rateArray.length; i++ ) {
            sum += parseInt( rateArray[i], 10 );
        }
        var avg = sum/rateArray.length;
        averageRate = avg;
      }

      checkingRatingAndUsersComment = (id) => {
        id = parseInt(id, 10);
        axios({
          method: 'get',
          url: 'http://13.55.208.161:3000/bookings/'+id,
          withCredentials: true,
        }).then(response => {
          rateStatus = true;
          commentStatus = true;
        }).catch((error) => {
        });
      }

      getAllUsersComments = () => {
        axios({
          method: 'get',
          url: 'http://13.55.208.161:3000/comments/'+this.props.match.params.id,
          withCredentials: true,
        }).then(response => {
            courseUsersComment = response.data;
        }).catch((error) => {

        });
      }

      getCourseOwnerDetails = (id) => {
        axios({
          method: 'get',
          url: 'http://13.55.208.161:3000/users/'+id,
          withCredentials: true,
        }).then(response => {
            this.setState({
              ownerData: response.data,
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


      componentWillMount() {
        this.getAllUsersComments();
        axios({
          method: 'get',
          url: 'http://13.55.208.161:3000/courses/'+this.props.match.params.id,
          withCredentials: true,
        }).then(response => {
            currentRate = response.data.rate ? response.data.rate : [5];
            data = response.data;
            course_id = this.props.match.params.id;

            if (response.data.user_id === parseInt(localStorage.user_id, 10)) {
              owned = true;
            }
            this.averageRating();
            if (localStorage.user_id) {
              this.checkingRatingAndUsersComment(response.data.id);
              this.getCourseOwnerDetails(response.data.user_id);
            }

            this.setState({
              data: data,
              course_id: course_id,
              currentRate: currentRate,
              owned: owned,
              rateStatus: rateStatus,
              commentStatus: commentStatus,
              averageRate: averageRate,
              courseUsersComment: courseUsersComment
            });

        }).catch((error) => {

        });



      }

      // componentDidMount() {
      //   this._isMounted = true;
      //
      //
      //
      //
      //
      // }
      // componentWillUnmount() {
      //   this._isMounted = false;
      // }

      render() {

      return (
          <div id='form-course-update'>
              { this.state.role ==='admin' || (this.state.role ==='officer' && this.state.owned === true)  ? (
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
                    <Descriptions title="About Course" layout="horizontal" column={{ sm: 2, xs: 1 }}>
                      <Descriptions.Item label="Course Content">
                        {this.state.data.course_content}
                      </Descriptions.Item>
                      <Descriptions.Item label="Price">
                        ${this.state.data.price}
                      </Descriptions.Item>
                      <Descriptions.Item label="Remaining Spot">
                        {this.state.data.remaining_spot}/{this.state.data.capacity}
                      </Descriptions.Item>
                      <Descriptions.Item label="Location">
                        {this.state.data.location}
                      </Descriptions.Item>
                      <Descriptions.Item label="Repeat On Every">
                        {this.state.data.repeat_on}
                      </Descriptions.Item>
                      <Descriptions.Item label="Semester">
                        From {this.state.data.start_date} to {this.state.data.end_date}
                      </Descriptions.Item>
                      <Descriptions.Item label="Session Length">
                        {this.state.data.time_from} - {this.state.data.time_to}
                      </Descriptions.Item>
                      <Descriptions.Item label="Age Group">
                        {this.state.data.age_group}
                      </Descriptions.Item>
                    </Descriptions>
                    <Rating
                      rateStatus={this.state.rateStatus}
                      currentRate={this.state.currentRate}
                      averageRate={this.state.averageRate}
                      rateSubmit={this.rateSubmit}
                      formProp={this.props.form}
                    />

                    {localStorage.user_id
                      &&
                      <Descriptions title={this.state.ownerData.business_name} layout="horizontal" column={1}>
                        <Descriptions.Item label="Phone">
                          {this.state.ownerData.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                          {this.state.ownerData.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                          {this.state.ownerData.description}
                        </Descriptions.Item>
                      </Descriptions>
                    }

                    <UsersCommentList
                      courseId={this.props.match.params.id}
                      comments={this.state.courseUsersComment}
                    />

                    {this.state.commentStatus
                      &&
                    <UsersComment
                      comprops={this.props}
                      getAllUsersComments={this.getAllUsersComments}
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
