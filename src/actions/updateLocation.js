import { fetchCategories, fetchUsers, fetchPosts } from './index'
import updatePostsFilter from './updatePostsFilter'
import { values } from 'lodash'

export default function ( location ) {
	return ( dispatch, getStore ) => {
		dispatch({
			type: 'LOCATION_UPDATED',
			payload: {
				location: location,
			}
		})

		let args = []
		/**
		 * /
		 */
		if ( location.pathname === '/' ) {
			dispatch( updatePostsFilter( { category: null } ) )
			return Promise.resolve()
		}
		/**
		 * /category/${categorySlug}/
		 */
		if ( args = location.pathname.match( /\/category\/([^\/]+)\// ) ) {
			let categorySlug = args[1]
			let category = values( getStore().categories ).filter( c => c.slug === categorySlug )[0]

			if ( ! category ) {
				return dispatch( fetchCategories( { slug: categorySlug } ) ).then( categories => {
					dispatch( updatePostsFilter( {category: categories[0].id} ) )
					return categories
				})
			}
			dispatch( updatePostsFilter( {category: category.id} ) )
			return Promise.resolve()
		}

		/**
		 * /author/${authorSlug}/
		 */
		if ( args = location.pathname.match( /\/author\/([^\/]+)\// ) ) {
			let authorSlug = args[1]
			let user = values( getStore().users ).filter( u => u.slug === authorSlug )[0]

			if ( ! user ) {
				return dispatch( fetchUsers( { slug: authorSlug } ) ).then( users => {
					dispatch( updatePostsFilter( {author: users[0].id} ) )
					return users
				})
			}
			dispatch( updatePostsFilter( {author: user.id} ) )
			return Promise.resolve()
		}

		/**
		 * /post/${postSlug}/
		 */
		if ( args = location.pathname.match( /\/post\/([^\/]+)\// ) ) {
			let postSlug = args[1]
			let post = values( getStore().posts ).filter( u => u.slug === postSlug )[0]

			if ( ! post ) {
				return dispatch( fetchPosts( { slug: postSlug } ) ).then( posts => {
					dispatch( updatePostsFilter( {id: posts[0].id} ) )
					return posts
				})
			}
			dispatch( updatePostsFilter( {id: post.id} ) )
			return Promise.resolve()
		}
	}
}
