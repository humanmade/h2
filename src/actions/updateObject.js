import httpapi from '../api'

/**
 * Update any object in the api.
 *
 * This is a helper function to make is simpler to update
 * objects of most type via the api. As all resources have a
 * `_links.self` in them, all we need to udpate any resource is the
 * resource it's self as long as the `_links` are present.
 *
 * To keep well named redux action names, an actionPrefix is required
 * to build the `type`.
 *
 * @param  Object object            The object to update in the api. Make sure it's an option that was fetfched from the api.
 * @param  String [actionPrefix=''] The action name prefix, e.g. "USER"
 */
export default function updateObject( object, actionPrefix = '' ) {
	return ( dispatch, getStore ) => {
		const store = getStore()
		const api = new httpapi( store.sites[ store.activeSite.id ] )
		dispatch({
			type: actionPrefix + '_UPDATING',
			payload: {
				object,
			},
		})
		api.post( object._links.self[0].href, object, function( data, err ) {
			if ( err ) {
				return dispatch({
					type: actionPrefix + '_UPDATE_ERRORED',
					payload: {
						object,
						error: err,
					}
				})
			}
			dispatch({
				type: actionPrefix + '_UPDATED',
				payload: {
					object: data
				}
			})
		})
	}
}
