export default function createFetchObjectsActionCreator(
	objectName,
	path,
	api,
	options = {}
) {
	return function actionCreator(filter = {}) {
		return (dispatch, getStore) => {
			dispatch({
				type: `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATING`,
				payload: {
					objectName,
					filter,
				},
			});
			return api
				.get(path, filter)
				.then( objects => options.singular ? [objects] : objects )
				.then(
					objects =>
						(options.parseObject ? objects.map(options.parseObject) : objects)
				)
				.then(objects => {
					dispatch({
						type: `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATED`,
						payload: {
							objectName,
							objects,
							filter,
						},
					});

					objects.forEach(object => {
						if (!object._embedded) {
							return;
						}
						if (options.relations) {
							Object.entries(
								options.relations
							).forEach(([relationName, relationOptions]) => {
								if ( ! object._embedded[relationOptions.uri] ) {
									return;
								}
								dispatch({
									type: `WP_API_REDUX_FETCH_${relationOptions.object.toUpperCase()}_UPDATED`,
									payload: {
										objects: relationOptions.singular
											? [object._embedded[relationOptions.uri][0]]
											: object._embedded[relationOptions.uri][0],
									},
								});
								dispatch({
									type: `WP_API_REDUX_FETCH_OBJECTS_RELATED_TO_${objectName.toUpperCase()}_UPDATED`,
									payload: {
										objectName,
										relatedObjectName: relationName,
										objectId: object.id,
										objects: relationOptions.singular
											? [object._embedded[relationOptions.uri][0]]
											: object._embedded[relationOptions.uri][0],
									},
								});
							});
						}
					});

					return objects;
				});
		};
	};
}
