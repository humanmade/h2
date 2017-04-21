export default function createFetchRelatedObjectsActionCreator(
	objectName,
	relatedObjectName,
	relatedObjectUri,
	api,
	options = {}
) {
	return function actionCreator(object) {
		return (dispatch, getStore) => {
			dispatch({
				type: `WP_API_REDUX_FETCH_${relatedObjectName.toUpperCase()}_UPDATING`,
				payload: {
					objectName: relatedObjectName,
				},
			});
			dispatch({
				type: `WP_API_REDUX_FETCH_OBJECTS_RELATED_TO_${objectName.toUpperCase()}_UPDATING`,
				payload: {
					objectName,
					relatedObjectName,
					objectId: object.id,
				},
			});
			return api
				.get(object['_links'][relatedObjectUri][0].href)
				.then(
					objects =>
						(options.parseObject ? objects.map(options.parseObject) : objects)
				)
				.then(objects => {
					dispatch({
						type: `WP_API_REDUX_FETCH_${relatedObjectName.toUpperCase()}_UPDATED`,
						payload: {
							objectName: relatedObjectName,
							objects,
						},
					});
					dispatch({
						type: `WP_API_REDUX_FETCH_OBJECTS_RELATED_TO_${objectName.toUpperCase()}_UPDATED`,
						payload: {
							objectName,
							relatedObjectName,
							objectId: object.id,
							objects,
						},
					});
					return objects;
				});
		};
	};
}
