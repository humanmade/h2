import PropTypes from 'prop-types';
import React from 'react';

import Button from '../Button';

import './TitleBar.css';

export default function TitleBar( props ) {
	return (
		<header className="Sidebar-TitleBar">
			<h2>{ props.title }</h2>
			<Button onClick={ props.onClose }>
				Close
			</Button>
		</header>
	);
}

TitleBar.propTypes = {
	onClose: PropTypes.func.isRequired,
	title:   PropTypes.string.isRequired,
};
