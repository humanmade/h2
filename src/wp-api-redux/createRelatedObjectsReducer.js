export default function createRelatedObjectsReducer( objectName, options ) {
	return ( state = {}, action ) => {
		switch ( action.type ) {
			case `WP_API_REDUX_FETCH_${options.relation.toUpperCase()}_RELATED_TO_${objectName.toUpperCase()}_UPDATING`: {
				return {
					...state,
					[action.payload.objectId]: {
						...[ action.payload.objectId ],
						isLoading: true,
					},
				};
			}
			case `WP_API_REDUX_FETCH_${options.relation.toUpperCase()}_RELATED_TO_${objectName.toUpperCase()}_UPDATED`: {
				return {
					...state,
					[action.payload.objectId]: {
						isLoading: false,
						hasLoaded: true,
						items:     action.payload.objects.map( object => object.id ),
						item:      action.payload.objects.length > 0
							? action.payload.objects[0].id
							: null,
					},
				};
			}
			case `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATED`: {
				action.payload.objects.forEach( o => {
					state[o.id] = {
						isLoading: false,
						hasLoaded: false,
						items:     [],
						item:      null,
					};
				} );
				return { ...state };
			}
			default: {
				if ( options.reducer ) {
					Object.entries( state ).forEach( ( [ id, object ] ) => {
						const newObject = options.reducer( object, action, id );
						if ( newObject !== object ) {
							state = {
								...state,
								[id]: newObject,
							};
						}
					} );
				}
				return state;
			}
		}
	};
}
