import api from '../api'

/**
 * Fetch terms of any taxonomy from the api.
 *
 * Specify the `taxonomy` property of `args` for the taxonomy. This taxonomy must exist in the
 * `taxonomies` in redux store for the site.
 *
 * @param  object args The arguments for the endpoint.
 */
export default function fetchUsers( args ) {
	return ( dispatch, getStore ) => {
		dispatch({
			type: 'USERS_UPDATING',
		})
		return api.get( '/wp/v2/users', args )
			.then( data => {
				dispatch({
					type: 'USERS_UPDATED',
					payload: {
						users: data
					}
				})
				return data
			})
	}
}
