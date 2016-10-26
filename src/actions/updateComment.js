import updateObject from './updateObject'

/**
 * Update a comment via the api.
 *
 * @param  object comment The comment to update, with the new data.
 */
export default function updateComment( comment  ) {
	// workaround current issue with embedded objects in requests
	comment = {
		...comment,
		content: comment.content.raw,
	}
	return updateObject( comment, 'COMMENTS_COMMENT' )
}
