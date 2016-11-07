export default function( data ) {
	return dispatch => {
		dispatch({
			type: 'POSTS_UPDATED',
			payload: {
				posts: data.posts,
			}
		})
		dispatch({
			type: 'USERS_UPDATED',
			payload: {
				users: data.users,
			}
		})
		dispatch({
			type: 'CATEGORIES_UPDATED',
			payload: {
				categories: data.categories,
			}
		})
		dispatch({
			type: 'USER_UPDATED',
			payload: {
				user: data.user,
			}
		})
		dispatch({
			type: 'COMMENTS_UPDATED',
			payload: {
				comments: data.comments,
			}
		})
	}
}
