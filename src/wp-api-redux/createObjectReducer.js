import createObjectWindowReducer from './createObjectWindowReducer';
import createRelatedObjectsReducer from './createRelatedObjectsReducer';

// Create a reducer for a given object name.
// Returns a reducer function.
export default function createObjectReducer(objectName, options = {}) {
	const initialState = {
		byId: {},
		isLoading: false,
		lastError: null,
		windows: {},
		totalObjects: null,
		totalPages: null,
	};
	if (options.windows) {
		Object.entries(options.windows).forEach(([window, opts]) => {
			initialState.windows[window] = {
				items: [],
				isLoading: false,
				filter: {},
				lastError: null,
				totalPages: null,
				totalObjects: null,
			};
		});
	}

	function updateWindows(state, action, options) {
		const windows = { ...state.windows };
		// find any windows that match this filter and update those too
		Object.entries(windows).forEach(([windowName, window]) => {
			const opts = options.windows[windowName];
			const reducer = createObjectWindowReducer(objectName, opts);
			windows[windowName] = reducer(window, action);
		});
		return {
			...state,
			windows,
		};
	}

	function updateRelated(state, action, options) {
		const related = { ...state.related };
		// find any windows that match this filter and update those too
		Object.entries(related).forEach(([relatedName, r]) => {
			const opts = options.related[relatedName];
			opts.relation = relatedName;
			const reducer = createRelatedObjectsReducer(objectName, opts);
			related[relatedName] = reducer(r, action);
		});
		return {
			...state,
			related,
		};
	}

	return function objectReducer(state = initialState, action) {
		switch (action.type) {
			case `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATING`:
				state = {
					...state,
					isLoading: true,
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
					totalObjects: action.payload.totalObjects,
					totalPages: action.payload.totalObjects,
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
			default:
			// nothing.
		}

		state = updateWindows(state, action, options);
		state = updateRelated(state, action, options);
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
