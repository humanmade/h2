import { combineReducers } from 'redux'

export default combineReducers({
	user: ( state = {}, action ) => {
		switch ( action.type ) {
			case 'USER_UPDATED':
				return action.payload.user
			default:
				return state
		}
	},
	users: ( state = {}, action ) => {
		switch ( action.type ) {
			case 'POSTS_UPDATED':
				action.payload.posts.forEach( post => {
					if ( ! post._embedded || ! post._embedded['author'] ) {
						return
					}
					const user = post._embedded['author'][0]
					state[ user.id ] = user
				})
				return {...state}
			case 'USERS_UPDATED':
				action.payload.users.forEach( user => {
					state[ user.id ] = user
				} )
				return {...state}
			default:
				return state
		}
	},
	categories: ( state = {}, action ) => {
		switch ( action.type ) {
			case 'POSTS_UPDATED':
				action.payload.posts.forEach( post => {
					if ( ! post._embedded || ! post._embedded['wp:term'] ) {
						return
					}
					post._embedded['wp:term'].forEach( rel => {
						rel.filter( term => term.taxonomy === 'category' ).forEach( term => {
							state[ term.id ] = term
						} )
					})
				})
				return {...state}
			case 'CATEGORIES_UPDATED':
				action.payload.categories.forEach( category => {
					state[ category.id ] = category
				} )
				return {...state}
			default:
				return state
		}
	},
	posts: ( state = {}, action ) => {
		switch ( action.type ) {
			case 'POSTS_UPDATED':
				action.payload.posts.forEach( post => {
					state[ post.id ] = post
				})
				return {...state}
			case 'POST_CREATED':
				state[ action.payload.post.id ] = action.payload.post
				return {...state}
			default:
				return state
		}
	},
	newPost: ( state = { isSaving: false, error: null }, action ) => {
		switch ( action.type ) {
			case 'POST_CREATING':
				return {...state, isSaving: true}
			case 'POST_CREATED':
				return {...state, isSaving: false, error: null}
			case 'POST_CREATE_ERRORED':
				return {...state, isSaving: false, error: action.payload.error}
			default:
				return state
		}
	},
	comments: ( state = {}, action ) => {
		switch ( action.type ) {
			case 'POSTS_UPDATED':
				action.payload.posts.forEach( post => {
					if ( ! post._embedded || ! post._embedded['replies'] ) {
						return
					}
					post._embedded['replies'].forEach( rel => {
						rel.forEach( comment => {
							if ( ! state[ comment.post ] ) {
								state[ comment.post ] = {}
							}
							state[ comment.post ][ comment.id ] = comment
						} )
					})
				})
				return {...state}
			case 'COMMENTS_UPDATED':
				action.payload.comments.forEach( comment => {
					if ( ! state[ comment.post ] ) {
						state[ comment.post ] = {}
					}
					state[ comment.post ][ comment.id ] = comment
				})
				return {...state}
			case 'COMMENT_CREATED':
				if ( ! state[ action.payload.comment.post ] ) {
					state[ action.payload.comment.post ] = {}
				}
				state[ action.payload.comment.post ][ action.payload.comment.id ] = action.payload.comment
				return {...state}
			default:
				return state
		}
	},
	newComment: ( state = { isSaving: false, error: null }, action ) => {
		switch ( action.type ) {
			case 'COMMENT_CREATING':
				return {...state, isSaving: true}
			case 'COMMENT_CREATED':
				return {...state, isSaving: false, error: null}
			case 'COMMENT_CREATE_ERRORED':
				return {...state, isSaving: false, error: action.payload.error}
			default:
				return state
		}
	},
	location: ( state = {}, action ) => {
		switch ( action.type ) {
			case 'LOCATION_UPDATED':
				return action.payload.location
			default:
				return state
		}
	},
	postsFilter: ( state = {}, action ) => {
		switch ( action.type ) {
			case 'POSTS_FILTER_UPDATED':
				return action.payload
			default:
				return state
		}
	}
})
