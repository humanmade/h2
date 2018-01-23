import { combineReducers } from 'redux';

import store from './store';

export default combineReducers( {
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
} );
