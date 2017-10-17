export default function createUpdateObjectWindowFilterActionCreator(
	objectName,
	window
) {
	return function actionCreator( filter ) {
		return ( dispatch, getStore ) => {
			dispatch( {
				type:    `WP_API_REDUX_${objectName.toUpperCase()}_WINDOW_FILTER_UPDATED`,
				payload: {
					objectName,
					window,
					filter,
				},
			} );
		};
	};
}
