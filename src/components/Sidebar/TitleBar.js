import PropTypes from 'prop-types';
import React from 'react';

import Button from '../Button';

const CLASSES = [
	'flex items-baseline justify-between overflow-hidden',
	'sticky top-0 z-2',
	'bg-hm-beige',
	'px-4 py-2',
].join( ' ' );

export default function TitleBar( props ) {
	return (
		<header className={ CLASSES }>
			<h2 className="text-lg font-bold">{ props.title }</h2>
			<Button
				className="m-0!"
				onClick={ props.onClose }
			>
				Close
			</Button>
		</header>
	);
}

TitleBar.propTypes = {
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
};
