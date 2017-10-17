export default function createFetchObjectActionCreator( objectName, path, api ) {
	return function actionCreator( objectId ) {
		return ( disaptch, getStore ) => {
			disaptch( {
				type:    'WP_API_REDUX_DELETE_OBJECT_UPDATING',
				payload: {
					objectName,
					objectId,
				},
			} );
			return api.del( `${path}/${objectId}` ).then( object => {
				disaptch( {
					type:    'WP_API_REDUX_DELETE_OBJECT_UPDATED',
					payload: {
						objectName,
						object,
						objectId,
					},
				} );
				return object;
			} );
		};
	};
}
