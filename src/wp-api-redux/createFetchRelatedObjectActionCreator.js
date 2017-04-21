export default function createFetchRelatedObjectActionCreator(
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
        type: `WP_API_REDUX_FETCH_OBJECT_RELATED_TO_${objectName.toUpperCase()}_UPDATING`,
        payload: {
          objectName,
          relatedObjectName,
          objectId: object.id,
        },
      });
      return api
        .get(object['_links'][relatedObjectUri][0].href)
        .then(
          object => options.parseObject ? options.parseObject(object) : object
        )
        .then(relatedObject => {
          dispatch({
            type: `WP_API_REDUX_FETCH_${relatedObjectName.toUpperCase()}_UPDATED`,
            payload: {
              objectName: relatedObjectName,
              objects: [relatedObject],
            },
          });
          dispatch({
            type: `WP_API_REDUX_FETCH_OBJECT_RELATED_TO_${objectName.toUpperCase()}_UPDATED`,
            payload: {
              objectName,
              relatedObjectName,
              objectId: object.id,
              object: relatedObject,
            },
          });
          return object;
        });
    };
  };
}
