// Create a reducer for a given object name.
// Returns a reducer function.
export default function createObjectReducer(objectName, options = {}) {
	const initialState = {
		byId: {},
		isLoading: false,
		lastError: null,
		windows: {},
	};
	if (options.windows) {
		options.windows.forEach(window => {
			initialState.windows[window] = {
				items: [],
				isLoading: false,
				filter: {},
				lastError: null,
			};
		});
	}
	return function objectReducer(state = initialState, action) {
		switch (action.type) {
			case `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATING`:
				state = {
					...state,
					isLoading: true,
					windows: updateWindows(state.windows, action),
				};
				break;
			case `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATED`:
				const objects = { ...state.byId };
				action.payload.objects.forEach(o => {
					objects[o.id] = parseObject(o, options, action);
				});
				state = {
					...state,
					isLoading: false,
					byId: objects,
					windows: updateWindows(state.windows, action),
				};
				break;

			case 'WP_API_REDUX_UPDATE_OBJECT_UPDATED':
				state = {
					...state,
					byId: {
						...state.byId,
						[action.payload.object.id]: parseObject(
							action.payload.object,
							options,
							action
						),
					},
				};
				break;
			case 'WP_API_REDUX_DELETE_OBJECT_UPDATED':
				const oldObjects = { ...state.objects };
				delete oldObjects[action.payload.objectId];
				state = {
					...state,
					byId: oldObjects,
				};
				break;
			case 'WP_API_REDUX_OBJECT_WINDOW_FILTER_UPDATED':
				state = {
					...state,
					windows: {
						...state.windows,
						[action.payload.window]: {
							...state.windows[action.payload.window],
							filter: action.payload.filter,
							items: [],
						},
					},
				};
				break;
			case `WP_API_REDUX_FETCH_OBJECTS_RELATED_TO_${objectName.toUpperCase()}_UPDATING`:
				state = {
					...state,
					byId: {
						...state.byId,
						[action.payload.objectId]: {
							...state.byId[action.payload.objectId],
							related: {
								...state.byId[action.payload.objectId].related,
								[action.payload.relatedObjectName]: {
									...state.byId[action.payload.objectId].related[
										action.payload.relatedObjectName
									],
									isLoading: true,
								},
							},
						},
					},
				};
				break;
			case `WP_API_REDUX_FETCH_OBJECTS_RELATED_TO_${objectName.toUpperCase()}_UPDATED`:
				state = {
					...state,
					byId: {
						...state.byId,
						[action.payload.objectId]: {
							...state.byId[action.payload.objectId],
							related: {
								...state.byId[action.payload.objectId].related,
								[action.payload.relatedObjectName]: {
									...state.byId[action.payload.objectId].related[
										action.payload.relatedObjectName
									],
									isLoading: false,
									hasLoaded: true,
									items: action.payload.objects.map(object => object.id),
									item: action.payload.objects.length > 0
										? action.payload.objects[0].id
										: null,
								},
							},
						},
					},
				};
				break;
			default:
			// nothing.
		}

		if (options.reducer) {
			Object.entries(state.byId).forEach(([id, object]) => {
				const newObject = options.reducer(object, action);
				if (newObject !== object) {
					state = {
						...state,
						byId: {
							...state.byId,
							[id]: newObject,
						},
					};
				}
			});
		}
		return state;
	};
}

function updateWindows(windows, action) {
	if (!action.payload.filter) {
		return windows;
	}
	windows = { ...windows };
	// find any windows that match this filter and update those too
	Object.entries(windows).forEach(([windowName, window]) => {
		if (
			JSON.stringify(window.filter) === JSON.stringify(action.payload.filter)
		) {
			windows = {
				...windows,
				[windowName]: {
					...window,
					isLoading: action.payload.objects ? false : true,
					items: [
						...windows[windowName].items,
						...(action.payload.objects
							? action.payload.objects.map(o => o.id)
							: []),
					],
				},
			};
		}
	});
	return windows;
}

function parseObject(object, options, action) {
	if (options.relations) {
		object.related = {};
		Object.entries(
			options.relations
		).forEach(([relatedObjectName, relatedObjectOptions]) => {
			object.related[relatedObjectName] = {
				isLoading: false,
				hasLoaded: false,
				items: [],
				item: null,
			};
		});
	}
	return object;
}
