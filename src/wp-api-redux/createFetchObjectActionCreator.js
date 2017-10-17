export default function createFetchObjectActionCreator(
  objectName,
  path,
  api,
  options = {}
) {
	return function actionCreator( objectId ) {
		return ( disaptch, getStore ) => {
			disaptch( {
				type:    `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATED`,
				payload: {
					objectName,
					objectId,
				},
			} );
			return api
        .get( `${path}/${objectId}` )
        .then(
          object => options.parseObject ? options.parseObject( object ) : object
        )
        .then( object => {
	disaptch( {
		type:    `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATED`,
		payload: {
			objectName,
			objectS: [ object ],
			objectId,
		},
	} );
	return object;
} );
		};
	};
}
