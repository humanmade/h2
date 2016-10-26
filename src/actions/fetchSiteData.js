import httpapi from '../api'

/**
 * Fetch the data for a site.
 *
 * This is retreived from the `/wp-json/` home of the rest api,
 * and includes information about all the routes, endpoints and
 * authentication options for the site.
 */
export default function fetchSiteData() {
	return ( dispatch, getStore ) => {
		dispatch({
			type: 'SITE_DATA_UPDATING',
		})

		const store = getStore()
		const site = store.sites[ store.activeSite.id ]
		const api = new httpapi( site )

		api.get( '/', { context: 'help' } ).then( data => {
			dispatch({
				type: 'SITE_DATA_UPDATED',
				payload: {
					site: data
				}
			})
		} )
		.catch( error => {
			dispatch({
				type: 'SITE_DATA_UPDATE_ERRORED',
				payload: {
					error
				}
			})
		})
	}
}
