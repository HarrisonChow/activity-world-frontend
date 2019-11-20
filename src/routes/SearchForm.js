import React from 'react';
import Search from './Search';
import axios from "axios";
import { Form, Button } from 'antd';
import '../style/search.css';

class SearchFormComponent extends React.Component {

    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          var term = {keyword: values.search.keyword, range:values.search.range}
          e.preventDefault();
          axios({
              method: 'get',
              url: 'http://13.55.208.161:3000/courses',
              params: term,
              withCredentials: true,
          }).then(response => {
            this.props.onChange(response);
          }).catch(error => {
          });
        }
      });
    };


    keywordCheck = (rule, value, callback) => {
      if (value.keyword) {
        callback();
        return;
      }
      callback('Please input the keyword!');
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (

            <Form className="searchContainer" layout="inline" onSubmit={this.handleSubmit}>
              <Form.Item className="searchInput">
                {getFieldDecorator('search', {
                  initialValue: { keyword: 'Hurstville', range: 'location' },
                  rules: [{ validator: this.keywordCheck }],
                })(<Search />)}
              </Form.Item>
              <Form.Item className="searchButton">
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
              </Form.Item>
            </Form>

        );
    }
}

const SearchForm = Form.create({ name: 'search_form' })(SearchFormComponent);

export default SearchForm;
