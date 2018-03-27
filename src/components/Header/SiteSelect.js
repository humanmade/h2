import React from 'react';
import { Link } from 'react-router-dom';

import Logo from './Logo';

import './SiteSelect.css';

export default class SiteSelect extends React.Component {
	render() {
		return <Link to="/" className="SiteSelect">
			<Logo />
			{ window.H2Data.site.name }
		</Link>;
	}
}
