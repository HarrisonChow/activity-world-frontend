import React from 'react';
import axios from "axios";
import '../style/courses.css';
import { Table, Alert } from 'antd';


export default class MyOrders extends React.Component {

    state = {
        loading: true,
        data: [],
        viewType: localStorage.user_role,
        success: 'none',
        alert: "none",
    }

    getData = () => {
        axios({
            method: 'get',
            url: 'http://13.55.208.161:3000/orders/'+this.props.match.params.id,
            withCredentials: true,
        }).then(response => {
            var allResults = response.data;

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
        });
    }

    componentWillMount() {
        this.getData();
    }

    render() {
        const columns = [
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'x',
                render: (text, record, index) =>{
                    if (text === "new") {
                        return <div>Pending</div>
                    } else {
                        return <div>Deliveried</div>
                    }

                }
            },
            {
                title: 'Order Number',
                dataIndex: 'order_id',
                key: 'order_id',
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
            {this.state.data.length ? <Table className="table-container" columns={columns} dataSource={this.state.data} /> : null}

        </div>
    );
  }
}
