import React from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import { Icon, Table, Popconfirm, Button } from 'antd';
import moment from 'moment';
import '../style/kidlist.css';

export default class Kidlist extends React.Component {
    state = {
        confirmDirty: false,
        errors: '',
        alert: 'none',
        gender: 'Male',
        data:[],
        bookedKid:[],
        nodata:false,
    }
    delete = (index,record) => {
        axios({
            method: 'post',
            url: 'http://13.55.208.161:3000/kids/'+record.id,
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        }).then(response => {
            this.getData();
        }).catch((error) => {

        });
    }
    redirectUpdate = (kid) => {
        this.props.history.push({pathname: '/kid/'+kid.id});
    }

    redirectUserPage = () => {
        if (localStorage.user_id) {
            this.props.history.push({pathname: '/users/'+localStorage.user_id});
        } else {
            this.props.history.push({pathname: '/login'});
        }
    }

    checkBookingStatus = (selectCourseId) => {
      var insideThis = this;
      this.state.data.forEach(function(ele, index) {
        axios({
            method: 'get',
            url: 'http://13.55.208.161:3000/bookings/',
            withCredentials: true,
            params: {
              kid_id: ele.id,
              course_id:selectCourseId,
            }
        }).then((response) => {
            var kid_name = response.data[0].first_name + ' ' + response.data[0].last_name;
            var kids = insideThis.state.bookedKid.concat(kid_name);
            insideThis.setState({
              bookedKid: kids ,
            });

        }).catch((error) => {

        });
      });

    }


    getData = () => {
        axios({
          method: 'get',
          url: 'http://13.55.208.161:3000/kid/'+localStorage.user_id,
          withCredentials: true,
        }).then(response => {
            response.data.forEach(function(kid) {
              kid.name = kid.first_name + ' ' + kid.last_name;
              kid.dob = moment(kid.dob).format('LL');
              delete kid.first_name;
              delete kid.last_name;
            })
            this.setState({
              data: response.data,
            });
            if (response.data.length === 0) {
              this.setState({
                nodata: true,
              });
              if (this.props.checkingKids) {
                this.props.checkingKids(false);
              }
            } else {
              if (this.props.checkingKids) {
                this.props.checkingKids(true);
              }
            }
            if (this.props.selectCourse) {
              this.checkBookingStatus(this.props.selectCourse);
            }
        }).catch((error) => {
            this.redirectUserPage();
        });
    }

    componentWillMount() {
        this.getData();
    }

    render() {
        const rowSelection = {
          onChange: (selectedRowKeys, selectedRows) => {
            this.props.selectKid(selectedRows);
          },
          getCheckboxProps: (record) => {
            return {
              disabled: this.state.bookedKid.includes(record.name), // Column configuration not to be checked
              name: record.name,
            };
          },
        };

        const actions = {
            title: 'My kids', dataIndex: 'id',key: 'x', render: (text, record, index) =>(
                <div onClick={(e) => e.stopPropagation()}>
                    <Popconfirm title="You sure want to delete it?"
                        onConfirm = {this.delete.bind(this, index, record)}
                    >
                        <Icon type="delete" />
                    </Popconfirm>
                </div>
        )}

        var kidColumns = [
            actions,
            {
                dataIndex: 'name',
                key: 'name',
            },
            {
                dataIndex: 'gender',
                key: 'gender',
            },
            {
                dataIndex: 'dob',
                key: 'dob',
            }
        ];
        var bookingKidColumns = [
            {
                dataIndex: 'name',
                key: 'name',
            },
        ];

    return (
            <div className="kidlistContainer">

              <Table
                rowSelection={ this.props.booking ? rowSelection : null }
                onRow={
                  this.props.booking ? null : (
                    (record) => (
                      { onClick: () => { this.redirectUpdate(record) } }
                    )
                  )
                }
                className="table-container"
                columns={this.props.booking ? bookingKidColumns: kidColumns}
                dataSource={this.state.data}
                rowKey="name"
                pagination={false}
                title={null}
                locale={{emptyText: 'No kid\'s info available. Please add it before booking!'}}

              />
              {this.state.nodata
                &&
                <Link to="/kid/add">
                  <Button type="primary" className="add-btn">
                    Add Kid info
                  </Button>
                </Link>
              }
            </div>
        );
    }
}
