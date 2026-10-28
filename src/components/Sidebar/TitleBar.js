import PropTypes from 'prop-types';
import React from 'react';

import Button from '../Button';

const CLASSES = [
	'flex items-baseline justify-between overflow-hidden',
	'sticky top-0 z-2',
	'bg-hm-beige',
	'm-0 -mx-[1em] mb-[1em] p-[0.5em]',
	'[&_h2]:normal-case [&_h2]:text-base [&_h2]:leading-[1.4] [&_h2]:m-0',
	'[&_.btn]:m-0',
].join( ' ' );

export default function TitleBar( props ) {
	return (
		<header className={ CLASSES }>
			<h2>{ props.title }</h2>
			<Button onClick={ props.onClose }>
				Close
			</Button>
		</header>
	);
}

TitleBar.propTypes = {
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
};
