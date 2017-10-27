export default function createFetchObjectActionCreator( objectName, path, api ) {
	return function actionCreator( objectId ) {
		return ( dispatch, getStore ) => {
			dispatch( {
				type:    `WP_API_REDUX_DELETE_${ objectName.toUpperCase() }_UPDATING`,
				payload: {
					objectName,
					objectId,
				},
			} );
			return api
				.del( `${path}/${objectId}` )
				.then( object => {
					dispatch( {
						type:    `WP_API_REDUX_DELETE_${ objectName.toUpperCase() }_UPDATED`,
						payload: {
							objectName,
							object,
							objectId,
						},
					} );
					return object;
				} )
				.catch( error => {
					dispatch( {
						type:    `WP_API_REDUX_DELETE_${objectName.toUpperCase()}_ERRORED`,
						payload: { error, objectId },
					} );
					throw error;
				} );
		};
	};
}
