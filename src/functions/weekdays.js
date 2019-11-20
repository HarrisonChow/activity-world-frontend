import React from 'react';
import { Select } from 'antd';

export function weekdays() {
  const { Option } = Select;
  const weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];


  const weekdaysChildren = [];

  for (let i = 0; i < 7; i++) {
    weekdaysChildren.push(<Option key={weekdays[i]}>{weekdays[i]}</Option>);
  }

  return weekdaysChildren;
}
