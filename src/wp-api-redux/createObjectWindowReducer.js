export default function createObjectWindowReducer( objectName, options ) {
	const defaultWindow = {
		items:        [],
		isLoading:    false,
		filter:       {},
		lastError:    null,
		totalPages:   null,
		totalObjects: null,
	};

	return ( state = defaultWindow, action ) => {
		switch ( action.type ) {
			case `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATING`: {
				return {
					...state,
					isLoading: true,
				};
			}
			case `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_ERRORED`: {
				return {
					...state,
					isLoading:    false,
					lastError:    action.payload.error,
					totalObjects: typeof action.payload.totalObjects !== 'undefined'
						? action.payload.totalObjects
						: state.totalObjects,
					totalPages: typeof action.payload.totalPages !== 'undefined'
						? action.payload.totalPages
						: state.totalPages,
				};
			}
			case `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATED`: {
				const nextItems = [
					...state.items,
					...action.payload.objects
						.filter(
							object =>
								( options.filter
									? options.filter( object, window.filter )
									: true )
						)
						.map( object => object.id ),
				];
				return {
					...state,
					items: nextItems.filter( ( item, idx ) => nextItems.indexOf( item ) === idx ),
					totalObjects: typeof action.payload.totalObjects !== 'undefined'
						? action.payload.totalObjects
						: state.totalObjects,
					totalPages: typeof action.payload.totalPages !== 'undefined'
						? action.payload.totalPages
						: state.totalPages,
				};
			}
			case `WP_API_REDUX_${objectName.toUpperCase()}_WINDOW_FILTER_UPDATED`:
				return {
					...state,
					filter: action.payload.filter,
					items:  [],
				};
			default:
				return state;
		}
	};
}
