import React from 'react';
import CarouselHome from './Carousel';
import CoursesList from './CoursesList';
import SearchForm from './SearchForm';
import NoSearchResult from './NoSearchResult';
import axios from "axios";
import '../style/home.css';

export default class Home extends React.Component {
    state = {
      data: [],
      loadtime: 0,
      loadingMore: false,
      showLoadingMore: false,
      showCarousel: true,
      noSearchResult: false,
      searchKeyword:"",
    };

    getData = (callback) => {
        axios({
            method: 'get',
            url: 'http://13.55.208.161:3000/courses',
            withCredentials: true,
            params: {"loadtimes" : this.state.loadtime},
        }).then(response => {
            callback(response);
        }).catch((error) => {
            this.errorChecking();
        });
    }

    errorChecking = () => {
    }

    componentWillMount() {
        this.getData();
    }

    componentDidMount() {
        this.getData((res) => {
            this.setState({
                data: res.data,
                loadtime: this.state.loadtime+1,
            });
            if (res.data.length >= 4) {
              this.setState({
                  showLoadingMore: true,
              });
            }
        });
    }

    onLoadMore = () => {
      this.setState({
          loadingMore: true,
      });
      this.getData((res) => {

          const data = this.state.data.concat(res.data);
          const loadtime = this.state.loadtime + 1;

          if (res.data.length < 4) {
            this.setState({
              showLoadingMore:false
            });
          }

          this.setState({
              data,
              loadingMore: false,
              loadtime,
          }, () => {
              window.dispatchEvent(new Event('resize'));
          });
      });
    }

    redirectLogin = () => {
        this.props.history.push({pathname: '/login'});
    }

    onChange = (res) => {
      if (res.data.length > 0) {
        this.setState({
            data: res.data,
            loadtime: this.state.loadtime+1,
            showCarousel:false
        });
        if (res.data.length >= 4) {
          this.setState({
              showLoadingMore: true,
          });
        } else {
          this.setState({
              showLoadingMore: false,
          });
        }
      } else {
        this.setState({
            data: [],
            showCarousel: false,
            showLoadingMore: false,
            noSearchResult: true,
            searchKeyword: res.config.params.keyword
        });
      }
    }

    render() {
        return (
            <div>
                <SearchForm onChange={this.onChange}/>
                {this.state.showCarousel && <CarouselHome />}
                <CoursesList courseData={this.state} onLoadMore={this.onLoadMore}/>
                {this.state.noSearchResult && <NoSearchResult keyword={this.state.searchKeyword}/>}
            </div>
        );
    }
}
