import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../Button';

export default function TitleBar( props ) {
	return (
		<header>
			<div className="px-4 py-4 bg-hm-beige">
				<h2 className="text-lg font-bold">
					<Link
						className="block hover:underline"
						to="/"
					>
						{ window.H2Data.site.name }
					</Link>
				</h2>
			</div>
			<div className="px-4 py-2 bg-hm-beige/50 sticky top-0 z-2 flex items-baseline justify-between overflow-hidden">
				<h2 className="font-bold">{ props.title }</h2>
				<Button
					className="m-0!"
					onClick={ props.onClose }
				>
					Close
				</Button>
			</div>
		</header>
	);
}

TitleBar.propTypes = {
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
};
