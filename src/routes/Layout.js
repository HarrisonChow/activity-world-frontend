import React from 'react';
import Navigation from './Navigation';
import MenuWeb from './Menu';
import Globalfooter from './Globalfooter';
import '../style/layout.css';

const Layout = props => ({
    render() {
      return (
          <div>
              <MenuWeb />
              <Navigation />
              <main className="container-box">{props.children}</main>
              <Globalfooter />
          </div>
      );
    }
});

export default Layout;
