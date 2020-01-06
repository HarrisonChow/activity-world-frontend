import React from 'react';
import axios from "axios";
import '../style/userprofile.css';
import { Card, Icon, Divider, Button, Alert } from 'antd';
import { Link } from 'react-router-dom';
import Kidlist from './Kidlist';
import Uploadimg from './Uploadimg';

const { Meta } = Card;
const queryString = require('query-string');


export default class Userprofile extends React.Component {
    state = {
        data: [],
        role: localStorage.user_role,
        success: 'none',
        kids: false,
        userId: this.props.match.params.id
    }

    componentWillMount() {
        axios({
          method: 'get',
          url: 'http://13.55.208.161:3000/users/'+this.props.match.params.id,
          withCredentials: true,
        }).then(response => {
            this.setState({
              data: response.data,
            });
        }).catch((error) => {
            this.redirectUserPage();
        });

        if (queryString.parse(this.props.location.search).success) {
            this.setState({
                success: 'block'
            });
            setTimeout(function(){
                this.setState({success:'none'});
            }.bind(this),5000);
        }

    }

    redirectUserPage = () => {
        if (localStorage.user_id) {
            this.props.history.push({pathname: '/users/'+localStorage.user_id});
        } else {
            this.props.history.push({pathname: '/login'});
        }
    }

    checkingKids = (status) => {
        this.setState({
          kids:status
        })
    }

    render() {
        return (
            <div>
                <div className="profile-header"><Icon type="user" /> User Info
                    <Link to={{pathname: '/users/update/'+localStorage.user_id}}>
                        <Button icon="edit" type="primary" className="edit-btn">
                            Edit
                        </Button>
                    </Link>
                </div>
                { this.state.role ==='admin' || this.state.role ==='officer'  ? (
                    <Card className="profileContainer">
                        <Meta
                            title="Business Name"
                            description={this.state.data.business_name}
                        />
                        <Divider dashed />
                        <Meta
                            title="Categories"
                            description={this.state.data.category}
                        />
                        <Divider dashed />
                        <Meta
                            title="Email Address"
                            description={this.state.data.email}
                        />
                        <Divider dashed />
                        <Meta
                            title="Contact Number"
                            description={this.state.data.phone}
                        />
                        <Divider dashed />
                        <Meta
                            title="ABN or ACN"
                            description={this.state.data.abn_acn}
                        />
                        <Divider dashed />
                        <Meta
                            title="Address"
                            description={this.state.data.address}
                        />
                        <Divider dashed />
                        <Meta
                            title="Postcode"
                            description={this.state.data.postcode}
                        />
                        <Divider dashed />
                        <Meta
                            title="About us"
                            description={this.state.data.description}
                        />
                    </Card>
                ) : (
                    <Card className="profileContainer">
                        <Meta
                            title="Email Address"
                            description={this.state.data.email}
                        />

                        <Divider dashed />

                        <Meta
                            title="Contact Number"
                            description={this.state.data.phone ? (this.state.data.phone): "Blank"}
                        />

                        <Divider dashed />

                        <Meta
                            title="Address"
                            description={this.state.data.address ? (this.state.data.address): "Blank"}
                        />

                        <Divider dashed />

                        <Meta
                            title="Postcode"
                            description={this.state.data.postcode ? (this.state.data.postcode): "Blank"}
                        />

                        <Divider dashed />

                        {this.state.kids
                          &&
                          <Link to="/kid/add">
                            <Button type="primary" className="add-btn">
                              Add Kid info
                            </Button>
                          </Link>
                        }

                    </Card>

                )}

                <Alert message="Update successful!" type="success" showIcon  style={{ display: this.state.success}}/>

                {this.state.role ==='client' && <Kidlist history={this.props.history} checkingKids = {this.checkingKids}/>}

                {this.state.role ==='officer' && <Uploadimg userId = {this.state.userId}/>}
            </div>
        );
    }
}
