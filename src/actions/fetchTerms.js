import httpapi from '../api'

/**
 * Fetch terms of any taxonomy from the api.
 *
 * Specify the `taxonomy` property of `args` for the taxonomy. This taxonomy must exist in the
 * `taxonomies` in redux store for the site.
 *
 * @param  object args The arguments for the endpoint.
 */
export default function fetchTerms( args ) {
	args = { context: 'edit', ...args }
	return ( dispatch, getStore ) => {
		dispatch({
			type: 'TAXONOMY_TERMS_UPDATING',
			payload: {
				taxonomy: args.taxonomy,
			}
		})

		const store = getStore()
		const site = store.sites[ store.activeSite.id ]
		const api = new httpapi( site )

		var url = site.data.taxonomies[ args.taxonomy ]._links['wp:items'][0].href
		api.get( url, args, function( data, err ) {

			if ( err ) {
				return
			}
			dispatch({
				type: 'TAXONOMY_TERMS_UPDATED',
				payload: {
					taxonomy: args.taxonomy,
					terms: data
				}
			})
		})
	}
}
