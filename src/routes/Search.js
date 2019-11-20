import React from 'react';
import { Input, Select } from 'antd';
// import '../style/search.css';

const { Option } = Select;

export default class Search extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      keyword: value.keyword || 'Hurstville',
      range: value.range || 'location',
    };
  }

  handleInputChange = e => {
    const keyword = e.target.value;

    if (!('value' in this.props)) {
      this.setState({ keyword });
    }
    this.triggerChange({ keyword });
  };

  handleRangeChange = range => {
    if (!('value' in this.props)) {
      this.setState({ range });
    }
    this.triggerChange({ range });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { size } = this.props;
    const { state } = this;
    return (
      <span>
        <Input
          type="text"
          size={size}
          value={state.keyword}
          onChange={this.handleInputChange}
          style={{ width: '65%', marginRight: '1%' }}
        />
        <Select
          value={state.range}
          size={size}
          style={{ width: '32%' }}
          onChange={this.handleRangeChange}
        >
          <Option value="location">Surburb</Option>
          <Option value="course_name">Course</Option>
        </Select>
      </span>
    );
  }
}
