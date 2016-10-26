import httpapi from '../api'

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
	return ( dispatch, getStore ) => {
		dispatch({
			type: 'COMMENTS_NEW_UPDATING',
			payload: {
				taxonomy: comment.taxonomy,
			}
		})

		const store = getStore()
		const site = store.sites[ store.activeSite.id ]
		const api = new httpapi( site )

		api.post( '/wp/v2/comments', comment )
			.then( comment => {
				dispatch({
					type: 'COMMENTS_NEW_UPDATED',
					payload: { comment },
				})
			})
	}
}
