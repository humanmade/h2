import PropTypes from 'prop-types';
import React from 'react';

import NavigationButton from './NavigationButton';
import SiteHeader from './SiteHeader';

export default function TitleBar( props ) {
	return (
		<header>
			<SiteHeader />
			<div className="px-4 py-2 bg-hm-beige/50 sticky top-0 z-2 flex items-center gap-2">
				<NavigationButton
					onClick={ props.onClose }
				>
					Close
				</NavigationButton>
				<h2 className="font-bold">{ props.title }</h2>
			</div>
		</header>
	);
}

TitleBar.propTypes = {
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
};
