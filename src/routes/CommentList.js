import React from 'react';

export default class CommentList extends React.Component {

    render() {
        const commentItems = this.props.comments.map((item, key) =>
            <li key={item.id}>{item.comment}</li>
        );
        return (
          <div>
            <ul>
              {commentItems}
            </ul>
          </div>
        );
    }
}
