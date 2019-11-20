import React from 'react';
import axios from "axios";
import '../style/courses.css';
import { Button, Icon, Table, Popconfirm,Alert } from 'antd';

const queryString = require('query-string');

export default class Orders extends React.Component {

    state = {
        loading: true,
        data: [],
        viewType: localStorage.user_role,
        success: 'none',
        alert: "none",
        allOrders: [],
    }

    confirm = (index,record) => {

        var values = {status: 'confirmed'};
        const updateCourses = this.state.allOrders.filter(item => item.order_id === record.order_id);

        axios({
            method: 'patch',
            url: 'http://13.55.208.161:3000/orders/'+record.order_id,
            data: values,
        }).then(response => {
            updateCourses.forEach(function(course) {
                var updateValue = {capacity: course.capacity-course.order_capacity}
                axios({
                    method: 'patch',
                    url: 'http://13.55.208.161:3000/courses/'+course.course_id,
                    data: updateValue,
                }).then(response => {
                }).catch(error => {
                });
            });

            this.getData();
            this.setState({
                success: 'block'
            });
            setTimeout(function(){
                this.setState({alert:'none'});
            }.bind(this),5000);

        }).catch(error => {
            this.setState({
                errors: error.response.data.message,
                alert: 'block'
            });
            setTimeout(function(){
                this.setState({alert:'none'});
            }.bind(this),5000);
        });
    }

    getData = () => {
        axios({
            method: 'get',
            url: 'http://13.55.208.161:3000/orders',
            withCredentials: true,
        }).then(response => {
            var allResults = response.data;
            this.setState({
                allOrders : allResults,
            });

            var combineResut = [];

            allResults.forEach(function(ele, index) {
                var existing = combineResut.filter(function(v) {
                    return v.order_id === ele.order_id;
                });


                if (existing.length) {
                    var existingIndex = combineResut.indexOf(existing[0]);
                    combineResut[existingIndex].price = combineResut[existingIndex].price+ele.price*ele.order_capacity;
                    combineResut[existingIndex].discount = combineResut[existingIndex].discount+ele.discount*ele.order_capacity;

                    combineResut[existingIndex].total = combineResut[existingIndex].price - combineResut[existingIndex].discount;

                    combineResut[existingIndex].courses =
                    combineResut[existingIndex].courses.concat(','+ele.course_name).concat(' X '+ ele.order_capacity);
                } else {
                    ele.price = ele.price * ele.order_capacity;
                    ele.discount = ele.discount * ele.order_capacity;
                    ele.courses = ele.course_name.concat(' X '+ ele.order_capacity);
                    combineResut.push(ele);
                }
            });

            this.setState({
                loading: false,
                data:combineResut.map(obj =>{
                    obj.key = obj.id+Math.random() * 100;
                    return obj;
                })
            });
        }).catch((error) => {
            // this.redirectHome();
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

    render() {

        var status = this.state.viewType ==='admin' ? {
            title: 'Status',
            dataIndex: 'status',
            key: 'x',
            render: (text, record, index) =>{
                if (text === "new") {
                    return <Popconfirm title="Order confirm?" >
                        <Button type="primary" shape="circle" icon="like-o" loading={this.state.iconLoading} onClick={this.confirm.bind(this, index, record)}/>
                    </Popconfirm>

                } else {
                    return <div><Button type="default" shape="circle" icon="shopping-cart"/></div>
                }

            }
        } : {
            title: 'Status',
            dataIndex: 'id',
            key: 'x', render: (text, record, index) =>(
                <div>
                    <Icon type="loading" />
                </div>
        )};

        const columns = [
            status,
            {
                title: 'Order Number',
                dataIndex: 'order_id',
                key: 'order_id',
            },

            {
                title: 'Client',
                dataIndex: 'user_name',
                key: 'user_name',
            },
            {
                title: 'Courses',
                dataIndex: 'courses',
                key: 'courses',
                render: (text, row, index) => {
                    text = text.split(',');
                    var listText=[];
                    text.forEach(function(ele, index) {
                        listText.push(<p key={index}>{ele}</p>)
                    })
                    return <div key={index}>{listText}</div>
                }
            },
            {
                title: 'Total Discount',
                dataIndex: 'discount',
                key: 'discount',
            },
            {
                title: 'Total Price',
                dataIndex: 'total',
                key: 'total',
            }
        ];


    return (
        <div>
            <Alert message="Order status updated!" type="success" showIcon  style={{ display: this.state.success}}/>
            {this.state.data.length ? <Table pagination={{ pageSize: 8 }} className="table-container" columns={columns} dataSource={this.state.data} /> : null}
        </div>
    );
  }
}
