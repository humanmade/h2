import { withArchive } from '@humanmade/repress';
import PropTypes from 'prop-types';
import qs from 'qs';
import React from 'react';

import PostHovercard from './PostHovercard';
import { Post as PostShape } from '../shapes';
import { posts } from '../types';

export function PostLink( props ) {
	const {
		children,
		loading,
		posts,
	} = props;

	if ( loading || ! posts || ! posts.length ) {
		return (
			<React.Fragment>
				{ children }
			</React.Fragment>
		);
	}

	const post = posts[0];

	return (
		<PostHovercard
			post={ post }
		>
			{ children }
		</PostHovercard>
	);
}

PostLink.propTypes = {
	href: PropTypes.string.isRequired,
	match: PropTypes.shape( {
		params: PropTypes.shape( {
			slug: PropTypes.string.isRequired,
		} ).isRequired,
	} ).isRequired,
	post: PostShape,
};

export default withArchive(
	posts,
	state => state.posts,
	props => {
		const filters = {
			slug: props.match.params.slug,
		};

		const id = qs.stringify( filters );
		posts.registerArchive( id, filters );
		return id;
	}
)( PostLink );
