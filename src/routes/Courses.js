import React from 'react';
import axios from "axios";
import { Button, Icon, Table, Input, Popconfirm,Alert, Modal } from 'antd';
import EditableCell from './EditableCell';
import '../style/courses.css';
import { Link } from 'react-router-dom';

const queryString = require('query-string');

export default class Courses extends React.Component {

    state = {
        loading: true,
        data: [],
        filterDropdownVisible: false,
        searchText: '',
        filtered: false,
        role: localStorage.user_role,
        success: 'none',
        visible: false,
        confirmLoading: false,
        previewCartData: [],
        alert: "none",
        viewType: localStorage.user_role,
    }

    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
    }

    changeCapacity = (index, record, value) => {
        var newPreviewCartData = [
            {
                "course_id": record.id,
                "key": record.key,
                "course_name": record.course_name,
                "price": record.price - record.discount,
                "capacity": value
            }
        ];

        this.state.previewCartData.map(obj =>{
            if (obj.course_id === record.key) {
                var key = this.state.previewCartData.indexOf(obj);
                this.state.previewCartData.splice(key, 1);
            }
            return obj;
        });

        this.setState({
            previewCartData : this.state.previewCartData.concat(newPreviewCartData),
        });
    }

    onCellChange =(key, dataIndex) => {
        return (value) => {
            const previewdataSource = [...this.state.previewCartData];
            const target = previewdataSource.find(item => item.key === key);
            if (target) {
                target[dataIndex] = parseFloat(value,10);
                this.setState({ previewdataSource });
            }
        };
    }

    redirectUpdate = (course) => {
        var selectedId = parseInt(course.key,10);
        this.props.history.push({pathname: '/course/'+selectedId});
    }

    redirectDetail = (course) => {
        var selectedId = parseInt(course.key,10);
        this.props.history.push({pathname: '/course/'+selectedId});
    }

    delete = (index,record) => {
        var deleteCourseId = parseInt(record.key,10);
        axios({
            method: 'post',
            url: 'http://13.55.208.161:3000/courses/'+deleteCourseId,
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        }).then(response => {
            this.getData();
        }).catch((error) => {

        });
    }

    removeOrder = (index,record) => {
        var key = this.state.previewCartData.indexOf(record);
        this.state.previewCartData.splice(key, 1);

        this.setState({
            previewCartData : this.state.previewCartData,
        });
    }

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

    getData = () => {
        axios({
            method: 'get',
            url: 'http://13.55.208.161:3000/courses',
            withCredentials: true,
            data: {
              user_id: localStorage.user_id
            }
        }).then(response => {
            this.setState({
                loading: false,
                data:response.data.map(obj =>{
                    obj.key = obj.id;
                    obj.special = (obj.price - obj.discount).toFixed(2);
                    return obj;
                })
            });
        }).catch((error) => {
            this.redirectHome();
        });
    }

    componentWillMount() {
        this.getData();
    }

    componentDidMount(){
        if (queryString.parse(this.props.location.search).success) {
            this.setState({
                success: 'block'
            });
            setTimeout(function(){
                this.setState({success:'none'});
            }.bind(this),5000);
        }
    }

    redirectHome = () => {
        this.props.history.push('/');
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    orderSubmit = () => {
        this.setState({
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
        var values = [{"user_id": localStorage.user_id}].concat(this.state.previewCartData);
        axios({
            method: 'post',
            url: 'http://13.55.208.161:3000/order/add',
            data: values,
        }).then(response => {
        }).catch((error) => {
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    render() {
        const activity_name = {
            className: 'activity_name',
            title: 'Activity Name',
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

        const actions = {
            title: 'Action', dataIndex: 'id',key: 'x', render: (text, record, index) =>(
                <div onClick={(e) => e.stopPropagation()}>
                    <Popconfirm title="You sure want to delete it?"
                        onConfirm = {this.delete.bind(this, index, record)}
                    >
                        <Icon type="delete" />
                    </Popconfirm>
                </div>
        )}

        const price = {
            className: 'price',
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        }

        const remaining_spot = {
            className: 'remaining_spot',
            title: 'Remaining spot',
            dataIndex: 'remaining_spot',
            key: 'remaining_spot',
        }

        var courseColumns;

        if (this.state.role ==='admin' || this.state.role ==='officer') {
            courseColumns = [
                actions,
                activity_name,
            ];
        } else {
            courseColumns = [
                activity_name,
                price,
                remaining_spot,
            ];
        }



        const previewdataSource = this.state.previewCartData;

        const newPreviewcolumns = [
            {
                title: 'Action',
                dataIndex: 'id',
                key: 'x', render: (text, record, index) => (
                    <Popconfirm title="You sure want to remove it?" >
                        <a onClick={this.removeOrder.bind(this, index, record)}><Icon type="delete" /></a>
                    </Popconfirm>)
            }, {
                title: 'Activitiy Name',
                dataIndex: 'course_name',
                key: 'name',
            }, {
                title: 'Capacity',
                dataIndex: 'capacity',
                render: (text, record) => (
                    <EditableCell
                        value={text}
                        onChange={this.onCellChange(record.key, 'capacity')}
                    />
                )
            }, {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
            }
        ];

    return (
        <div>
            <Alert message="Update successful!" type="success" showIcon  style={{ display: this.state.success}}/>
            {this.state.viewType ==='admin' || this.state.viewType ==='officer'  ? (
                <Link to={{pathname: '/course/add'}}>
                    <Button icon="plus-square-o" type="primary" className="add-btn">
                        Add Course
                    </Button>
                </Link>

            ) : (
                ''
            )}

            {this.state.data.length ?
              <Table
                pagination={{ pageSize: 8 }}
                onRow={(record) => ({
                    onClick: () => {if (this.state.role ==='admin' || this.state.role ==='officer') {
                        this.redirectUpdate(record)
                    } else {
                        this.redirectDetail(record)
                    }}
                })}
                className="table-container"
                columns={courseColumns}
                dataSource={this.state.data}
              />
            : null}

            <Modal title="Title"
                visible={this.state.visible}
                onOk={this.orderSubmit}
                confirmLoading={this.state.confirmLoading}
                onCancel={this.handleCancel}
                okText='Confirm'
                cancelText='Continue Shopping'
            >
                <Table dataSource={previewdataSource} columns={newPreviewcolumns} />
            </Modal>
        </div>
    );
  }
}
