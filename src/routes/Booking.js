import React from 'react';
import axios from "axios";
import { Button, Icon, Table, Input, Popconfirm,Alert, Tag } from 'antd';
import '../style/booking.css';
import uuid from 'uuid';

export default class Booking extends React.Component {

    state = {
        loading: true,
        data: [],
        filterDropdownVisible: false,
        searchText: '',
        filtered: false,
        role: localStorage.user_role,
        visible: false,
        confirmLoading: false,
        previewCartData: [],
        alert: "none",
        cancel: "none",
        confirm: "none",
        delete: "none",
        expandKey: [],
        contactDetail: [],
        expandedRows:[],
        cancelNotice: [],
    }

    //redirect Home page
    redirectHome = () => {
        this.props.history.push('/');
    }

    //confirm application

    applicationConfirm = (index,record) => {
        var applicationId = parseInt(record.booking_id,10);
        var courseId = parseInt(record.course_id,10);
        var remaining_spot = parseInt(record.remaining_spot,10);
        this.capacityUpdate(courseId, remaining_spot);

        var values = {
          status: 1
        }
        axios({
            method: 'patch',
            url: 'http://13.55.208.161:3000/bookings/'+applicationId,
            data: values,
            withCredentials: true
        }).then(response => {
            this.getData();
            this.setState({
                confirm: 'block'
            });
            setTimeout(function(){
                this.setState({confirm:'none'});
            }.bind(this),5000);
            this.capacityUpdate(courseId, remaining_spot);
        }).catch((error) => {

        });
    }

    capacityUpdate = (courseId, spot) => {
        var values = {
          remaining_spot: spot - 1
        }
        axios({
            method: 'patch',
            url: 'http://13.55.208.161:3000/Courses/'+courseId,
            data: values,
        }).then(response => {
        }).catch((error) => {
        });
    }

    //delete booking as officer
    delete = (index,record) => {
        var bookingId = parseInt(record.booking_id,10);
        var values = {
          status: 3
        }
        axios({
            method: 'patch',
            url: 'http://13.55.208.161:3000/bookings/'+bookingId,
            data: values,
        }).then(response => {
            this.getData();
            this.setState({
                delete: 'block'
            });
            setTimeout(function(){
                this.setState({delete:'none'});
            }.bind(this),5000);
        }).catch((error) => {

        });
    }

    adminDelete = (index,record) => {
        var bookingId = parseInt(record.booking_id,10);

        axios({
            method: 'post',
            url: 'http://13.55.208.161:3000/bookings/'+bookingId,
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        }).then(response => {
            this.getData();
        }).catch((error) => {

        });
    }

    // cancel booking as client
    cancel = (index,record) => {
        var bookingId = parseInt(record.booking_id,10);
        var values = {
          status: 2
        }
        axios({
            method: 'patch',
            url: 'http://13.55.208.161:3000/bookings/'+bookingId,
            data: values,
            withCredentials: true,
        }).then(response => {
            this.getData();
            this.setState({
                cancel: 'block'
            });
            setTimeout(function(){
                this.setState({cancel:'none'});
            }.bind(this),5000);
        }).catch((error) => {

        });
    }

    //input search keyword
    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
    }

    // booking search on the table head
    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText,
            data: this.state.data.map((record,index) => {
                const match = record.course_name.match(reg);
                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    name: (
                        <span key={index}>
                            {record.course_name.split(reg).map((text, i) => (
                                i > 0 ? [<span className="highlight" key={i}>{match[0]}</span>, text] : text
                            ))}
                        </span>
                    ),
                };
            }).filter(record => !!record),
        });
    }

    // get bookings data as client
    getData = () => {
        axios({
            method: 'get',
            url: 'http://13.55.208.161:3000/bookings/',
            withCredentials: true,
            params: {
              user_role: localStorage.user_role
            }
        }).then(
          response => {
            var filterData = [];
            var cancelData =[];
            response.data.map(obj =>{
                if (obj.status !== 3) {
                  filterData.push(obj);
                } else {
                  cancelData.push(obj);
                }
                return obj;
            })

            this.setState({
                loading: false,
                data:filterData.map(obj =>{
                    obj.key = obj.id + uuid.v4();
                    obj.kid_name = obj.first_name + " " + obj.last_name;
                    obj.course_time = obj.time_from + '-' + obj.time_to;
                    obj.course_date = obj.start_date + '-' + obj.end_date;
                    return obj;
                }),
                cancelNotice:cancelData.map(obj =>{
                    obj.key = obj.id + uuid.v4();
                    obj.kid_name = obj.first_name + " " + obj.last_name;
                    return obj;
                }),
            });
          }
        ).catch((error) => {

        });
    }

    // get school's contact details
    getContactDetail = (id) => {
      axios({
        method: 'get',
        url: 'http://13.55.208.161:3000/users/'+id,
        withCredentials: true,
      }).then(response => {
          this.setState({
            contactDetail: response.data,
          });
      }).catch((error) => {
          this.redirectHome();
      });
    }

    // client click row toggleCollapsed school information
    handelOnClientClick(record, index, event) {
        this.getContactDetail(record.user_id);

        let expandedRows = this.state.expandedRows;
        let expandKey = this.state.expandKey;

        if (expandKey[0] === record.key) {
          expandedRows.length = 0;
          expandKey.length = 0;
        } else if (expandKey[0] !== record.key) {
          expandedRows.length = 0;
          expandKey.length = 0;
          expandedRows.push(record.key);
          expandKey.push(record.key);
        }

        this.setState({
          expandedRows: expandedRows,
          expandKey:expandKey
        });
    }

    handelOnOfficerClick(record, index, event) {
    }

    // collapsed school's contact details
    showhtml(record, index){
      let map = "https://maps.google.com/?q="+this.state.contactDetail.address;
      let call = "tel:"+this.state.contactDetail.phone;
      let email = "mailto:"+this.state.contactDetail.email;
        return (
          <div>
            <p><a href = {map}>{this.state.contactDetail.address}</a></p>
            <p><a href = {call}>{this.state.contactDetail.phone}</a></p>
            <p><a href = {email}>{this.state.contactDetail.email}</a></p>
            {record.status === 0 ?
                <div>
                    <Button disabled type="dashed" size="small">waiting confirm</Button>
                </div>
            : record.status === 1 ?
                <Popconfirm title="You sure want to cancel it?"
                    onConfirm = {this.cancel.bind(this, index, record)}
                >
                    <Button type="danger" size="small">Cancel</Button>
                </Popconfirm>
            : record.status === 2 ?
                <div>
                    <Button disabled type="dashed" size="small">Pending</Button>
                </div>
            : <div></div>
            }
          </div>
        );
    }

    componentWillMount() {
        this.getData();
    }

    cancelAlertOnClose = function (id) {
      axios({
        method: 'post',
        url: 'http://13.55.208.161:3000/bookings/'+id,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }).then(response => {
      }).catch((error) => {
      });
    };


    render() {
        const activity_name = {
            title: 'Course',
            dataIndex: 'course_name',
            key: 'course_name',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="Search name"
                        value={this.state.searchText}
                        onChange={this.onInputChange}
                        onPressEnter={this.onSearch}
                    />
                    <Button type="primary" onClick={this.onSearch}>
                        Search
                    </Button>
                </div>
            ),
            filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
            filterDropdownVisible: this.state.filterDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterDropdownVisible: visible,
                }, () => this.searchInput && this.searchInput.focus());
            },
        };

        const kid_name = {
            title: 'Name',
            dataIndex: 'kid_name',
            key: 'kid_name',
        }
        const course_time = {
            title: 'Date&time',
            key: 'course_time',
            render: (text, record) => (
              <span>
                <p>{record.start_date} - {record.end_date}</p>
                <p>{record.time_from} - {record.time_to}</p>
                <p>{record.repeat_on.join()}</p>
              </span>
            )
        }

        const kid_details = {
            title: 'Kid details',
            dataIndex: 'kid_details',
            render: (text, record) => (
              <span>
                <p>{record.kid_name}</p>
                <p>{record.age_group}</p>
                <p>{record.gender}</p>
              </span>
            )
        }


        const contact_details = {
            title: 'Contact details',
            dataIndex: 'contact_details',
            render: (text, record) => (
              <span>
                <p>{record.email}</p>
                <p>{record.phone}</p>
              </span>
            )
        }

        const adminActions = {
            title: '', dataIndex: 'id',key: 'x', render: (text, record, index) =>(
                <div onClick={(e) => e.stopPropagation()}>
                    <Popconfirm title="You sure want to delete it?"
                        onConfirm = {this.adminDelete.bind(this, index, record)}
                    >
                        <Icon type="delete" />
                    </Popconfirm>
                </div>
        )}

        const actions = {
            title: '', dataIndex: 'id',key: 'x', render: (text, record, index) =>(
                <div onClick={(e) => e.stopPropagation()}>
                    {record.status === 0 ?
                    <div>
                      <Popconfirm title="Application confirm ?"
                          onConfirm = {this.applicationConfirm.bind(this, index, record)}
                      >
                        <Button className="app_confirm">Confirm</Button>
                      </Popconfirm>
                    </div>
                    : record.status === 1 ?
                    <div>
                      <Tag color="cyan">Actived</Tag>
                    </div>
                    : record.status === 2 ?
                    <div>
                      <Popconfirm title="Agree cancelation?"
                          onConfirm = {this.delete.bind(this, index, record)}
                      >
                        <Button className="con_cancel" type="dashed">Confirm <br/> Cancelation</Button>
                      </Popconfirm>
                    </div>
                    :
                    <div></div>
                    }
                </div>
        )}

        var bookingColumns;

        if (this.state.role ==='admin') {
            bookingColumns = [
                adminActions,
                activity_name,
                kid_details,
                contact_details
            ];
        } else if (this.state.role ==='officer') {
          bookingColumns = [
              actions,
              activity_name,
              kid_details,
              contact_details
          ];
        } else {
            bookingColumns = [
                activity_name,
                kid_name,
                course_time,
            ];
        }


    return (
        <div>

          <Alert message="Cancelation request has been submit! Please wait for the confirmation!" type="cancel" showIcon  style={{ display: this.state.cancel}}/>
          <Alert message="Booking confirmed!" type="confirm" showIcon  style={{ display: this.state.confirm}}/>
          <Alert message="Booking has been deleted!" type="delete" showIcon  style={{ display: this.state.delete}}/>

          {
              this.state.cancelNotice.map(obj =>{
                return <Alert message={obj.kid_name+" "+obj.course_name + " course has been canceled"} showIcon closable closeText="Close Now"  onClose={() => this.cancelAlertOnClose(obj.booking_id)}/>
              })
          }


            <Table
              pagination={false}
              className="table-container"
              columns={bookingColumns}
              expandIconAsCell={false}
              expandIconColumnIndex={-1}
              rowClassName={ (record, index) =>
                record.status === 0 ?
                        "applying"
                : record.status === 1 ?
                        "actived"
                : record.status === 2 ?
                        "cancelling"
                : ""
              }
              dataSource={this.state.data}
              expandedRowKeys={this.state.expandedRows}

              expandedRowRender={((record, index) => this.showhtml(record, index))}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    this.state.role ==='officer' ? this.handelOnOfficerClick(record) : this.handelOnClientClick(record);
                  }
                };
              }}
            />

        </div>
    );
  }
}
