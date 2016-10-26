import api from '../api'

/**
 * Create a post via the api.
 *
 * @param  object post   The post object.
 */
export default function createPost( post ) {
	return ( dispatch, getStore ) => {
		dispatch({
			type: 'POST_CREATING',
		})
		api.post( '/wp/v2/posts', post )
			.then( post => {
				dispatch({
					type: 'POST_CREATED',
					payload: {
						post,
					},
				})
			})
			.catch( err => {
				dispatch({
					type: 'POST_CREATE_ERRORED',
					payload: {
						error: err,
					},
				})
			})
	}
}
