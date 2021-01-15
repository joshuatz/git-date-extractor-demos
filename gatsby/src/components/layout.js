import * as React from 'react';
import '../styles/main.css';
import '../../node_modules/flexboxgrid/dist/flexboxgrid.min.css';

const Layout = ({ children }) => {
	return <div className="container">{children}</div>;
};

export default Layout;
