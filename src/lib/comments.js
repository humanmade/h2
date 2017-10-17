/**
 * Convert flat list of comments to nested thread of comments.
 *
 * @param {Array} comments List of comments to thread.
 *
 * @return {Array} Top-level comments.
 */
export const threadComments = comments => {
    // Group comments by key.
	const keyed = [];
	comments.forEach( comment => {
		keyed[ comment.id ] = Object.assign( {}, comment, { children: [] } );
	} );

    // Add children to comments.
	comments.forEach( comment => {
		if ( ! comment.parent ) {
			return;
		}

		keyed[ comment.parent ].children.push( comment.id );
	} );

	return keyed;
};
