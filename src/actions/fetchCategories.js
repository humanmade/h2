import api from '../api'

/**
 * Fetch terms of any taxonomy from the api.
 *
 * Specify the `taxonomy` property of `args` for the taxonomy. This taxonomy must exist in the
 * `taxonomies` in redux store for the site.
 *
 * @param  object args The arguments for the endpoint.
 */
export default function fetchCategories( args ) {
	return ( dispatch, getStore ) => {
		dispatch({
			type: 'CATEGORIES_UPDATING',
			payload: {
				taxonomy: args.taxonomy,
			}
		})
		return api.get( '/wp/v2/categories', args )
			.then( data => {
				dispatch({
					type: 'CATEGORIES_UPDATED',
					payload: {
						categories: data
					}
				})
				return data;
			})
	}
}
