import PropTypes from 'prop-types';
import React from 'react';

import NavigationButton from './NavigationButton';
import SiteHeader from './SiteHeader';

export default function TitleBar( props ) {
	return (
		<header className="Sidebar-site">
			<SiteHeader />
			<NavigationButton className="Sidebar-back" iconOnly={ false } onClick={ props.onClose }>
				Back to navigation
			</NavigationButton>
			<h3 className="Sidebar-browser-title">{ props.title }</h3>
		</header>
	);
}

TitleBar.propTypes = {
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
};
