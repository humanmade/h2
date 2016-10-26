import httpapi from '../api'

/**
 * Fetch users for the api.
 *
 * By default this will only return 10 users from the api.
 *
 * @param object args The arguments for the endpoint.
 */
export default function fetchUsers( args ) {
	return ( dispatch, getStore ) => {
		const store = getStore()
		const api = new httpapi( store.sites[ store.activeSite.id ] )

		args = { context: 'edit', ...args }

		dispatch({
			type: 'USERS_UPDATING',
		})
		api.get( '/wp/v2/users', args, function( data, err ) {
			if ( err ) {
				return dispatch({
					type: 'USERS_UPDATE_ERRORED',
					payload: {
						error: err
					}
				})
			}
			dispatch({
				type: 'USERS_UPDATED',
				data: data
			})
		})
	}
}
