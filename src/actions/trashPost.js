import httpapi from '../api'

/**
 * Trash a post via the api.
 *
 * Note: This is for post-type of "post" onle, this will be migrated to
 * a new function soon that supports all post types.
 *
 * @todo Support all post types.
 */
export default function trashPost( postId ) {
	return ( dispatch, getStore ) => {
		const store = getStore()
		const api = new httpapi( store.sites[ store.activeSite.id ] )

		dispatch({
			type: 'POSTS_POST_TRASHING',
		})
		api._delete( '/wp/v2/posts/' + postId, {}, function( data, err ) {
			dispatch({
				type: 'POSTS_POST_TRASHED',
				postId: postId
			})
		})
	}
}
