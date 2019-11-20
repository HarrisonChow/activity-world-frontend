import React from 'react';
import { Select } from 'antd';

export function ageGroup() {
  const { Option } = Select;
  const ages = ['1-2','3-5','6-9','10+','N/A'];

  const agesChildren = [];

  for (let i = 0; i < 5; i++) {
    agesChildren.push(<Option key={ages[i]}>{ages[i]}</Option>);
  }

  return agesChildren;
}
