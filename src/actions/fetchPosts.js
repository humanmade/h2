import api from '../api'

/**
 * Fetch posts of any type from the api.
 *
 * Specify the `type` property of `args` for the type. This type must exist in the
 * `types` in redux store for the site.
 *
 * @param  object args The arguments for the endpoint.
 */
export default function fetchPosts( args ) {
	args = { ...args, _embed: true }
	return ( dispatch, getStore ) => {
		dispatch({
			type: 'POSTS_UPDATING',
		})
		api.get( '/wp/v2/posts', args )
			.then( posts => {
				dispatch({
					type: 'POSTS_UPDATED',
					payload: {
						posts
					}
				})
			})
	}
}
