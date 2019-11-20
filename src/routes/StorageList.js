import React from 'react';
import '../style/courses.css';
import {  Table} from 'antd';

export default class StorageList extends React.Component {

    state = {
        loading: true,
        data: [],
    }



    componentWillMount() {
    }



    redirectHome = () => {
        this.props.history.push('/');
    }




    render() {



        const columns = [
            {
                title: 'Course Name',
                dataIndex: 'class_name',
                key: 'class_name',
            },
            {
                title: 'Capacity',
                dataIndex: 'capacity',
                key: 'capacity',
            }
        ];


    return (
        <div>

            {this.state.data.length ? <Table className="table-container" columns={columns} dataSource={this.state.data} /> : null}

        </div>
    );
  }
}
