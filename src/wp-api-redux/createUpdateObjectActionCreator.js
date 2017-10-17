export default function createFetchObjectActionCreator(
	objectName,
	path,
	api,
	options = {}
) {
	return function actionCreator( objectId, data ) {
		return ( disaptch, getStore ) => {
			disaptch( {
				type:    'WP_API_REDUX_UPDATE_OBJECT_UPDATING',
				payload: {
					objectName,
					objectId,
				},
			} );
			return api
				.post( `${path}/${objectId}`, data )
				.then(
					object => ( options.parseObject ? options.parseObject( object ) : object )
				)
				.then( object => {
					disaptch( {
						type:    'WP_API_REDUX_UPDATE_OBJECT_UPDATED',
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
