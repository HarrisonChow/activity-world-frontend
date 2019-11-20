import React from 'react';
import { Carousel, Icon } from 'antd';
import '../style/carousel.css';

export default class CarouselHome extends React.Component {
    constructor(props) {
      super(props);
      this.next = this.next.bind(this);
      this.previous = this.previous.bind(this);
      this.carousel = React.createRef();
    }
    next() {
      this.carousel.next();
    }
    previous() {
      this.carousel.prev();
    }

    render() {
        const settings = {
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1
        };
        return (
          <div className="carousel-container">
            <Icon type="left-circle" onClick={this.previous} className="previous-button"/>
            <Carousel autoplay effect="fade" ref={node => (this.carousel = node)} {...settings}>
              <div>
                <img src="https://via.placeholder.com/468x230?text=kids01" alt="kids01" className="responsive" />
              </div>
              <div>
                <img src="https://via.placeholder.com/468x230?text=kids02" alt="kids02" className="responsive" />
              </div>
              <div>
                <img src="https://via.placeholder.com/468x230?text=kids03" alt="kids03" className="responsive" />
              </div>
              <div>
                <img src="https://via.placeholder.com/468x230?text=kids04" alt="kids04" className="responsive" />
              </div>
            </Carousel>
            <Icon type="right-circle" onClick={this.next} className="next-button"/>
          </div>
        );
    }
}
