import { combineReducers } from 'redux'
const user = {"id":1,"name":"humanmade","url":"","description":"","link":"http:\/\/h2.hmn.dev\/author\/humanmade\/","slug":"humanmade","avatar_urls":{"24":"http:\/\/0.gravatar.com\/avatar\/f61a530df6549067e68ac84c9eb35881?s=24&d=mm&r=g","48":"http:\/\/0.gravatar.com\/avatar\/f61a530df6549067e68ac84c9eb35881?s=48&d=mm&r=g","96":"http:\/\/0.gravatar.com\/avatar\/f61a530df6549067e68ac84c9eb35881?s=96&d=mm&r=g"},"meta":{},"can":null,"_links":{"self":[{"href":"http:\/\/h2.hmn.dev\/wp-json\/wp\/v2\/users\/1"}],"collection":[{"href":"http:\/\/h2.hmn.dev\/wp-json\/wp\/v2\/users"}]}}

export default combineReducers({
	user: s => user,
	users: ( state = {}, action ) => {
		switch ( action.type ) {
			case 'POSTS_UPDATED':
				action.payload.posts.forEach( post => {
					if ( ! post._embedded['author'] ) {
						return
					}
					const user = post._embedded['author'][0]
					state[ user.id ] = user
				})
				return {...state}
			default:
				return state
		}
	},
	categories: ( state = {}, action ) => {
		switch ( action.type ) {
			case 'POSTS_UPDATED':
				action.payload.posts.forEach( post => {
					if ( ! post._embedded['wp:term'] ) {
						return
					}
					post._embedded['wp:term'].forEach( rel => {
						rel.filter( term => term.taxonomy === 'category' ).forEach( term => {
							state[ term.id ] = term
						} )
					})
				})
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
	}
})
