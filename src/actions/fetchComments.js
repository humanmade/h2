import api from '../api'

/**
 * Fetch comments from the api.
 *
 * By default this will only fetch 10 comments, specify `page` / `per_page`
 * in the args paramter to modify this.
 *
 * @param  object args Arguments passed to the comments endpoint.
 */
export default function fetchComments( args ) {
	args = { context: 'view', ...args }
	return dispatch => {
		dispatch({
			type: 'COMMENTS_UPDATING'
		})
		api.get( '/wp/v2/comments', args )
		 	.then( data => {
				dispatch({
					type: 'COMMENTS_UPDATED',
					payload: {
						comments: data
					}
				})
			})
			.catch( err => {
				dispatch({
					type: 'COMMENTS_UPDATE_ERRORED',
					payload: {
						error: err
					}
				})
			})
	}
}
