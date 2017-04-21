export default function createUpdateObjectWindowFilterActionCreator(
  objectName,
  window
) {
  return function actionCreator(filter) {
    return (dispatch, getStore) => {
      dispatch({
        type: 'WP_API_REDUX_OBJECT_WINDOW_FILTER_UPDATED',
        payload: {
          objectName,
          window,
          filter,
        }
      });
    };
  };
}
