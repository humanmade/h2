import httpapi from '../api'

/**
 * Fetch comments from the api.
 *
 * By default this will only fetch 10 comments, specify `page` / `per_page`
 * in the args paramter to modify this.
 *
 * @param  object args Arguments passed to the comments endpoint.
 */
export default function fetchComments( args ) {
	args = { context: 'edit', ...args }
	return ( dispatch, getStore ) => {
		dispatch({
			type: 'COMMENTS_UPDATING'
		})

		const store = getStore()
		const site = store.sites[ store.activeSite.id ]
		const api = new httpapi( site )

		api.get( '/wp/v2/comments', args, function( data, err ) {

			if ( err ) {
				return
			}
			dispatch({
				type: 'COMMENTS_UPDATED',
				payload: {
					comments: data
				}
			})
		})
	}
}
