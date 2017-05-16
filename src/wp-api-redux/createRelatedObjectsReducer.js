export default function createRelatedObjectsReducer(objectName, options) {
	const defaultState = {
		isLoading: false,
		hasLoaded: false,
		items: [],
		item: null,
	};

	return (state = defaultState, action) => {
		switch (action.type) {
			case `WP_API_REDUX_FETCH_${options.relation.toUpperCase()}_RELATED_TO_${objectName.toUpperCase()}_UPDATING`:
				return {
					...state,
					isLoading: true,
				};
			case `WP_API_REDUX_FETCH_${options.relation.toUpperCase()}_RELATED_TO_${objectName.toUpperCase()}_UPDATED`:
				return {
					...state,
					isLoading: false,
					hasLoaded: true,
					items: action.payload.objects.map(object => object.id),
					item: action.payload.objects.length > 0
						? action.payload.objects[0].id
						: null,
				};
			default:
				return state;
		}
	};
}
