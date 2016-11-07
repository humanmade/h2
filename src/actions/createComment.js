import api from '../api'

/**
 * Create a comment via the api.
 *
 * Creates a new comment, which can be a reply to a comment or new top
 * level comment. The post id of the comment should be passed as part
 * of the comment object.
 *
 * @param  object comment The comment object.
 */
export default function createComment( comment ) {
	return dispatch => {
		dispatch({
			type: 'COMMENT_CREATING',
		})
		return api.post( '/wp/v2/comments', comment )
			.then( comment => {
				dispatch({
					type: 'COMMENT_CREATED',
					payload: { comment },
				})
			})
			.catch( err => {
				dispatch({
					type: 'COMMENT_CREATE_ERRORED',
					payload: {
						error: err,
					},
				})
			})
	}
}
