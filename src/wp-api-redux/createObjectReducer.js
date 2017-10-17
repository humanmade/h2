import createObjectWindowReducer from './createObjectWindowReducer';
import createRelatedObjectsReducer from './createRelatedObjectsReducer';

// Create a reducer for a given object name.
// Returns a reducer function.
export default function createObjectReducer( objectName, options = {} ) {
	const initialState = {
		byId:         {},
		isLoading:    false,
		lastError:    null,
		windows:      {},
		totalObjects: null,
		totalPages:   null,
		relations:    {},
	};
	if ( options.windows ) {
		Object.entries( options.windows ).forEach( ( [ window, opts ] ) => {
			initialState.windows[window] = {
				items:        [],
				isLoading:    false,
				filter:       {},
				lastError:    null,
				totalPages:   null,
				totalObjects: null,
			};
		} );
	}

	if ( options.relations ) {
		Object.entries( options.relations ).forEach( ( [ relationName, opts ] ) => {
			initialState.relations[relationName] = {
				isLoading: true,
				hasLoaded: false,
			};
		} );
	}

	function updateWindows( state, action, options ) {
		const windows = { ...state.windows };
		// find any windows that match this filter and update those too
		Object.entries( windows ).forEach( ( [ windowName, window ] ) => {
			const opts = options.windows[windowName];
			const reducer = createObjectWindowReducer( objectName, opts );
			windows[windowName] = reducer( window, action );
		} );
		return {
			...state,
			windows,
		};
	}

	function updateRelated( state, action, options ) {
		if ( ! options.relations ) {
			return state;
		}
		// find any relations that match this filter and update those too
		Object.entries( options.relations ).forEach( ( [ relationName, relation ] ) => {
			relation.relation = relationName;
			const reducer = createRelatedObjectsReducer( objectName, relation );
			state.relations[relationName] = reducer(
				state.relations[relationName],
				action
			);
		} );
		return { ...state };
	}

	return function objectReducer( state = initialState, action ) {
		switch ( action.type ) {
			case `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATING`: {
				state = {
					...state,
					isLoading: true,
				};
				break;
			}
			case `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATED`: {
				const objects = { ...state.byId };
				action.payload.objects.forEach( o => {
					objects[o.id] = o;
				} );
				state = {
					...state,
					isLoading:    false,
					byId:         objects,
					totalObjects: action.payload.totalObjects,
					totalPages:   action.payload.totalObjects,
				};
				break;
			}
			case 'WP_API_REDUX_DELETE_OBJECT_UPDATED': {
				const oldObjects = { ...state.objects };
				delete oldObjects[action.payload.objectId];
				state = {
					...state,
					byId: oldObjects,
				};
				break;
			}
			default:
			// nothing.
		}

		state = updateWindows( state, action, options );
		state = updateRelated( state, action, options );
		if ( options.reducer ) {
			Object.entries( state.byId ).forEach( ( [ id, object ] ) => {
				const newObject = options.reducer( object, action );
				if ( newObject !== object ) {
					state = {
						...state,
						byId: {
							...state.byId,
							[id]: newObject,
						},
					};
				}
			} );
		}
		return state;
	};
}
