import React from 'react';
import axios from "axios";
import { List, Button, Spin, Icon } from 'antd';
import { Link } from 'react-router-dom';
import '../style/users.css';

export default class Users extends React.Component {
  state = {
    loading: true,
    loadingMore: false,
    showLoadingMore: true,
    loadtime: 0,
    data: [],
  }
  componentDidMount() {
    this.getData((res) => {
      this.setState({
        loading: false,
        data: res.data,
        loadtime: this.state.loadtime+1,
      });
    });
  }
  getData = (callback) => {
      axios({
        method: 'get',
        url: 'http://13.55.208.161:3000/users',
        withCredentials: true,
        params: {"loadtimes" : this.state.loadtime}
      }).then(response => {
          callback(response);
      }).catch((error) => {
          this.redirectHome();
      });
  }

  redirectHome = () => {
      this.props.history.push('/');
  }
  redirectUsers = () => {
      this.props.history.push('/users');
  }


  deleteUser = (id) => {
      axios({
        method: 'post',
        url: 'http://13.55.208.161:3000/users/'+id,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }).then(response => {
          this.setState({
            loading: true,
            data: [],
            loadtime: 0,
          });
          this.getData((res) => {
            this.setState({
              loading: false,
              data: res.data,
              loadtime: this.state.loadtime+1,
            });
          });
      }).catch((error) => {

      });
  }

  userActive = (id) => {
      var values = {"is_active": true};
      axios({
        method: 'patch',
        url: 'http://13.55.208.161:3000/users/'+id,
        data: values,
      }).then(response => {
         this.redirectUsers();
      }).catch((error) => {

      });
  }

  onLoadMore = () => {
    this.setState({
      loadingMore: true,
    });
    this.getData((res) => {
      const data = this.state.data.concat(res.data);
      const loadtime = this.state.loadtime + 1;

      this.setState({
        data,
        loadingMore: false,
        loadtime,
      }, () => {
        window.dispatchEvent(new Event('resize'));
      });
    });
  }
  render() {
    const { loading, loadingMore, showLoadingMore, data } = this.state;
    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin />}
        {!loadingMore && <Button onClick={this.onLoadMore}>loading more</Button>}
      </div>
    ) : null;

    return (
        <div>
            <List
                className="users-list"
                loading={loading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={data}
                renderItem={item => (

                <div className="user-item">
                    <Link to={ '' +item.id }>
                        <List.Item>
                            <List.Item.Meta
                                title={item.business_name}
                                description={item.email}
                            />
                            {!item.is_active&&<Button onClick={() => this.userActive(item.id)} className="active-btn">Active</Button>}

                            <div>{item.phone} </div>
                        </List.Item>
                    </Link>
                    <a onClick={() => this.deleteUser(item.id)}><Icon type="delete" /> </a>
                </div>

                )}
            />
        </div>
    );
  }
}
