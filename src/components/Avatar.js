import PropTypes from 'prop-types';
import React from 'react';

import AuthorLink from './Message/AuthorLink';

const CLASSES = [
	// Back-compat:
	'Avatar',

	'relative',

	// Circular border overlay (::after pseudo-element).
	'after:content-[\'\']',
	'after:block after:absolute after:inset-0',
	'after:border-2 after:border-black/10 after:rounded-full',
	'after:z-[1] after:pointer-events-none',

	// Child img styles.
	'[&_img]:max-w-none [&_img]:rounded-full [&_img]:bg-white',

	// Remove AuthorLink hover border.
	'[&_.AuthorLink:hover]:border-none',
].join( ' ' );

export default function Avatar( props ) {
	const size = props.size + 'px';

	const classes = props.className ? `${ CLASSES } ${ props.className }` : CLASSES;

	return (
		<div
			className={ classes }
			style={ {
				width: size,
				height: size,
			} }
		>
			<AuthorLink
				user={ props.user || null }
				withHovercard={ props.withHovercard }
			>
				<img
					className={ props.imgClassName }
					style={ {
						width: props.size,
						height: props.size,
					} }
					alt="User Avatar"
					src={ props.url || window.H2Data.site.default_avatar }
				/>
			</AuthorLink>
		</div>
	);
}

Avatar.propTypes = {
	className: PropTypes.string,
	imgClassName: PropTypes.string,
	size: PropTypes.number.isRequired,
	url: PropTypes.string.isRequired,
	user: PropTypes.object,
	withHovercard: PropTypes.bool.isRequired,
};

Avatar.defaultProps = {
	withHovercard: true,
};
