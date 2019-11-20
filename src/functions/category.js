import React from 'react';
import { Select } from 'antd';

export function allCategory() {
  const { Option } = Select;
  const categories = ['Soccer','Basketball','Swimming','Tennis','Badminton','Drawing','Photography','Sculpture','Sketching','Painting','Printmaking','Advertising','Public art','Screen','Media arts','Design','Multimedia','Craft','Architecture','Coding','Industrial design','Game design','Augmented/virtual reality','Graphic design','Fashion design','Radio','Creative writing','Languages','Publishing','Public speaking','Poetry','Music','Drama','Singing','Circus arts','Creative expression','Choreography','Synchronised swimming','Parkour','Theatre','Dance','Ballet'];

  const categoryChildren = [];

  for (let i = 0; i < 41; i++) {
    categoryChildren.push(<Option key={categories[i]}>{categories[i]}</Option>);
  }

  return categoryChildren;
}
