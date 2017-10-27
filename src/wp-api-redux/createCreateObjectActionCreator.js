export default function createCreateObjectActionCreator(
	objectName,
	path,
	api,
	options = {}
) {
	return function actionCreator( data ) {
		return ( dispatch, getStore ) => {
			dispatch( {
				type:    `WP_API_REDUX_CREATE_${objectName.toUpperCase()}_UPDATING`,
				payload: { data },
			} );
			return api
				.post( `${path}`, data )
				.then(
					object => ( options.parseObject ? options.parseObject( object ) : object )
				)
				.then( object => {
					dispatch( {
						type:    `WP_API_REDUX_FETCH_${objectName.toUpperCase()}_UPDATED`,
						payload: {
							objectName,
							objects: [ object ],
						},
					} );
					dispatch( {
						type:    `WP_API_REDUX_CREATE_${objectName.toUpperCase()}_UPDATED`,
						payload: {
							objectName,
							object,
						},
					} );
					return object;
				} )
				.catch( error => {
					dispatch( {
						type:    `WP_API_REDUX_CREATE_${objectName.toUpperCase()}_ERRORED`,
						payload: { error, data },
					} );
					throw error;
				} );
		};
	};
}
