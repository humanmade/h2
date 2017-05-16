export default function createObjectWindowReducer(objectName, options) {
	const defaultWindow = {
		items: [],
		isLoading: false,
		filter: {},
		lastError: null,
		totalPages: null,
		totalObjects: null,
	};

	return (state = defaultWindow, action) => {
		switch (action.type) {
			case `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATING`: {
				return {
					...state,
					isLoading: true,
				};
			}
			case `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_ERRORED`: {
				return {
					...state,
					isLoading: false,
					lastError: action.payload.error,
					totalObjects: action.payload.totalObjects
						? action.payload.totalObjects
						: state.totalObjects,
					totalPages: action.payload.totalPages
						? action.payload.totalPages
						: state.totalPages,
				};
			}
			case `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATED`:
				return {
					...state,
					items: [
						...state.items,
						...action.payload.objects
							.filter(
								object =>
									(options.filter
										? options.filter(object, window.filter)
										: true)
							)
							.map(object => object.id),
					],
				};
			case `WP_API_REDUX_${objectName.toUpperCase()}_WINDOW_FILTER_UPDATED`:
				state = {
					...state,
					filter: action.payload.filter,
					items: Object.values(state.byId)
						.filter(object =>
							options.windows[action.payload.window].filter(
								object,
								action.payload.filter
							)
						)
						.map(object => object.id),
				};
				break;
			default:
				return state;
		}
	};
}
