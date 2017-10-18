export default function createFetchObjectsActionCreator(
	objectName,
	path,
	api,
	options = {}
) {
	return function actionCreator( filter = {} ) {
		return ( dispatch, getStore ) => {
			dispatch( {
				type:    `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATING`,
				payload: {
					objectName,
					filter,
				},
			} );
			return api
				.get( path, { ...filter, _envelope: true } )
				.then( response => {
					if ( response.status >= 400 ) {
						throw new Error( response.body.message );
					}
					if ( options.singular ) {
						response.body = [ response.body ];
					}
					if ( options.parseObject ) {
						response.body = response.body.map( options.parseObject );
					}
					return response;
				} )
				.then( response => {
					const objects = response.body;
					dispatch( {
						type:    `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATED`,
						payload: {
							objectName,
							objects,
							filter,
							totalObjects: typeof response.headers['X-WP-Total'] === 'number'
								? response.headers['X-WP-Total']
								: null,
							totalPages: typeof response.headers['X-WP-TotalPages'] === 'number'
								? response.headers['X-WP-TotalPages']
								: null,
						},
					} );

					objects.forEach( object => {
						if ( ! object._embedded ) {
							return;
						}
						if ( options.relations ) {
							Object.entries(
								options.relations
							).forEach( ( [ relationName, relationOptions ] ) => {
								if ( ! object._embedded[relationOptions.uri] ) {
									return;
								}
								dispatch( {
									type:    `WP_API_REDUX_FETCH_${relationOptions.object.toUpperCase()}_UPDATED`,
									payload: {
										objects: relationOptions.singular
											? [ object._embedded[relationOptions.uri][0] ]
											: object._embedded[relationOptions.uri][0],
									},
								} );
								dispatch( {
									type:    `WP_API_REDUX_FETCH_${relationName.toUpperCase()}_RELATED_TO_${objectName.toUpperCase()}_UPDATED`,
									payload: {
										objectName,
										relatedObjectName: relationName,
										objectId:          object.id,
										objects:           relationOptions.singular
											? [ object._embedded[relationOptions.uri][0] ]
											: object._embedded[relationOptions.uri][0],
									},
								} );
							} );
						}
					} );

					return objects;
				} )
				.catch( error => {
					dispatch( {
						type:    `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_ERRORED`,
						payload: { error },
					} );
					throw error;
				} );
		};
	};
}
