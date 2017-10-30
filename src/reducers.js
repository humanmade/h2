import { combineReducers } from 'redux';

import store from './store';

export default combineReducers( {
	user:       store.reducers.user,
	users:      store.reducers.users,
	categories: store.reducers.categories,
	posts:      store.reducers.posts,
	tags:       store.reducers.tags,
	comments:   store.reducers.comments,
	media:      store.reducers.media,
	reactions:  ( state = {}, action ) => {
		const s = { ...state };

		const setPostUpdating = postId => {
			if ( ! ( 'updatingForPost' in s ) ) {
				s.updatingForPost = [];
			}

			if ( postId ) {
				s.updatingForPost.push( postId );
			}
		}

		const unsetPostUpdating = postId => {
			let index = s.updatingForPost.indexOf( postId );

			if ( index >= 0 ){
				s.updatingForPost.splice( index, 1 );
			}
		}

		switch ( action.type )  {
			case 'WP_API_REDUX_FETCH_REACTIONS_UPDATING' : {
				if ( 'filter' in action.payload && 'post' in action.payload.filter ) {
					setPostUpdating( action.payload.filter.post );
				}
				return s;
			}
			case 'WP_API_REDUX_FETCH_REACTIONS_UPDATED' : {
				if ( ! ( 'byId' in s ) ) {
					s.byId = {};
				}
				action.payload.objects.forEach( reaction => {
					s.byId[reaction.id] = {
						author:   reaction.author,
						id:       reaction.id,
						postId:   reaction.post,
						type:     reaction.type,
						typeName: reaction.type_name,
					};
				} );

				let filter = action.payload.filter;
				let post  = ( filter && 'post' in filter ) ? filter.post : null;
				unsetPostUpdating( post )

				return s;
			}
			case 'WP_API_REDUX_DELETE_REACTIONS_UPDATED' : {
				delete s.byId[ action.payload.objectId ];
				return s;
			}
			case 'WP_API_REDUX_CREATE_REACTIONS_UPDATING' : {
				setPostUpdating( parseInt( action.payload.data.post, 10 ) );
				return s;
			}
			case 'WP_API_REDUX_CREATE_REACTIONS_UPDATED' : {
				unsetPostUpdating( parseInt( action.payload.object.post, 10 ) )
				return s;
			}
			case 'WP_API_REDUX_CREATE_REACTIONS_ERRORED' : {
				unsetPostUpdating( parseInt( action.payload.data.post, 10 ) )
				return s;
			}
			case 'WP_API_REDUX_DELETE_REACTIONS_ERRORED' : {
				unsetPostUpdating( parseInt( action.payload.objectId, 10 ) )
				return s;
			}
			default : {
				return state;
			}
		}
	},
	// state: WriteCommentsState = {}, action: Action
	writeComments: ( state = { posts: {}, comments: {} }, action ) => {
		switch ( action.type ) {
			case 'WP_API_REDUX_FETCH_POSTS_UPDATED': {
				const s = { ...state.posts };
				action.payload.objects.forEach( post => {
					s[post.id] = {
						isShowing: false,
						comment:   {
							post:    post.id,
							parent:  0,
							content: {
								rendered: '',
								raw:      '',
								// edited: '',
							},
							author: 0,
							id:     0,
						},
					};
				} );
				return { ...state, posts: s };
			}
			case 'WP_API_REDUX_FETCH_COMMENTS_UPDATED': {
				const s = { ...state.comments };
				action.payload.objects.forEach( comment => {
					s[comment.id] = {
						isShowing: false,
						comment:   {
							post:    comment.post,
							parent:  comment.id,
							content: {
								rendered: '',
								raw:      '',
								// edited: '',
							},
							author: 0,
							id:     0,
						},
					};
				} );
				return { ...state, comments: s };
			}
			case 'SHOW_REPLY_TO_POST': {
				return {
					...state,
					posts: {
						...state.posts,
						[action.payload.postId]: {
							...state.posts[action.payload.postId],
							isShowing: true,
						},
					},
				};
			}
			case 'SHOW_REPLY_TO_COMMENT': {
				return {
					...state,
					comments: {
						...state.comments,
						[action.payload.commentId]: {
							...state.comments[action.payload.commentId],
							isShowing: true,
						},
					},
				};
			}
			case 'WRITE_COMMENT_CANCELLED': {
				if ( action.payload.comment.parent ) {
					return {
						...state,
						comments: {
							...state.comments,
							[action.payload.comment.parent]: {
								...state.comments[action.payload.comment.parent],
								isShowing: false,
							},
						},
					};
				} else {
					return {
						...state,
						posts: {
							...state.posts,
							[action.payload.postId]: {
								...state.posts[action.payload.postId],
								isShowing: false,
							},
						},
					};
				}
			}
			case 'WRITE_COMMENT_UPDATED': {
				if ( action.payload.comment.parent ) {
					return {
						...state,
						comments: {
							...state.comments,
							[action.payload.comment.parent]: {
								...state.comments[action.payload.comment.parent],
								comment: {
									...state.comments[action.payload.comment.parent].comment,
									...action.payload.comment,
								},
							},
						},
					};
				} else {
					return {
						...state,
						posts: {
							...state.posts,
							[action.payload.postId]: {
								...state.posts[action.payload.postId],
								comment: {
									...state.posts[action.payload.postId].comment,
									...action.payload.comment,
								},
							},
						},
					};
				}
			}
			case 'WP_API_REDUX_CREATE_COMMENTS_UPDATED': {
				return {
					...state,
					[action.payload.object.post]: {
						isShowing: false,
						comment:   {
							post:    action.payload.object.post,
							content: {
								rendered: '',
								raw:      '',
								// edited: FrontKit.content(),
							},
							author: 0,
							id:     0,
						},
					},
				};
			}
			default: {
				return state;
			}
		}
	},
	// action: Action
	writePost: (
		state = {
			isShowing: false,
			post:      {
				title: {
					rendered: '',
					edited:   '',
				},
				id:       0,
				content:  { rendered: '', raw: '' /*edited: FrontKit.content()*/ },
				date_gmt: new Date().toISOString(),
			},
		},
		action
	) => {
		switch ( action.type ) {
			case 'SHOW_WRITE_POST':
				return {
					...state,
					isShowing: true,
				};
			case 'WRITE_POST_CANCELLED':
				return {
					...state,
					isShowing: false,
				};
			case 'WP_API_REDUX_CREATE_POSTS_UPDATED':
				return {
					...state,
					isShowing: false,
					post:      {
						title: {
							rendered: '',
							edited:   '',
						},
						id:       0,
						content:  { rendered: '', raw: '' /*edited: FrontKit.content()*/ },
						date_gmt: new Date().toISOString(),
					},
				};
			default:
				return state;
		}
	},
} );
