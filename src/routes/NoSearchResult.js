import React from 'react';

export default class NoSearchResult extends React.Component {
  render() {
    const pStyle = {
      fontSize: '15px',
      textAlign: 'center',
      margin: '20px'
    };
    return (
      <span style={pStyle}>
        Your search - <strong> {this.props.keyword} </strong> - did not match any courses.
      </span>
    );
  }
}
