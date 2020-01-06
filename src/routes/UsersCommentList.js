import React from 'react';
import axios from "axios";
import { Comment, List, Tooltip} from 'antd';
import moment from 'moment';

export default class UsersCommentList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        commentUser: [],
        data: []
       };
      this.getCommentsOwnerDetails = this.getCommentsOwnerDetails.bind(this);
    }


    getCommentsOwnerDetails = (item) => {
      return axios({
        method: 'get',
        url: 'http://13.55.208.161:3000/users/'+item.parent_id,
        withCredentials: true,
      }).then(response => {
          let data = [];
          let commentData = {};
          commentData.actions = [<span key={item.id}>Reply to</span>];
          commentData.author = response.data.email;
          commentData.avatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';
          commentData.content = (
            <p>
              {item.comment}
            </p>
          );
          commentData.datetime = (
            <Tooltip
              title={moment(item.created_at)
                .format('YYYY-MM-DD HH:mm:ss')}
            >
              <span>
                {moment(item.created_at)
                  .fromNow()}
              </span>
            </Tooltip>
          );
          data.push(commentData);
          return data;
      }).catch((error) => {
      });
    }

    componentWillReceiveProps(nextProps) {
      let datas = [];
      nextProps.comments.map((item, key) => {
        this.getCommentsOwnerDetails(item).then(response => {
          datas = datas.concat(response);
          this.setState({
            data: datas
          });
        });
      })
    }

    render() {
        const data = this.state.data;

        return (
          <List
            className="comment-list"
            header={`${data.length} replies`}
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <li>
                <Comment
                  actions={item.actions}
                  author={item.author}
                  avatar={item.avatar}
                  content={item.content}
                  datetime={item.datetime}
                />
              </li>
            )}
          />
        );
    }
}
