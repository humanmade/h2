import PropTypes from 'prop-types';

export const Post = PropTypes.shape( {
	title: PropTypes.shape( {
		rendered: PropTypes.string.isRequired,
		edited: PropTypes.string,
	} ).isRequired,
	content: PropTypes.shape( {
		rendered: PropTypes.string.isRequired,
		raw: PropTypes.string,
		edited: PropTypes.string,
	} ).isRequired,
	author: PropTypes.number.isRequired,
	id: PropTypes.number.isRequired,
	date_gmt: PropTypes.string.isRequired,
	related: PropTypes.shape( {
		comments: PropTypes.shape( {
			items: PropTypes.arrayOf( PropTypes.number ).isRequired,
			isLoading: PropTypes.bool.isRequired,
			hasLoaded: PropTypes.bool.isRequired,
		} ).isRequired,
	} ),
} );

export const User = PropTypes.shape( {
	name: PropTypes.string.isRequired,
	avatar_urls: PropTypes.shape( {
		'96': PropTypes.string.isRequired,
	} ).isRequired,
} );

export const WindowState = PropTypes.shape( {
	items: PropTypes.arrayOf( PropTypes.number ).isRequired,
	totalObjects: PropTypes.number,
	totalPages: PropTypes.number,
	isLoading: PropTypes.bool,
} );

export const Comment = PropTypes.shape( {
	id: PropTypes.number.isRequired,
	content: PropTypes.shape( {
		rendered: PropTypes.string.isRequired,
		raw: PropTypes.string,
		edited: PropTypes.object,
	} ).isRequired,
	author: PropTypes.number.isRequired,
	post: PropTypes.number.isRequired,
} );

export const Action = PropTypes.shape( {
	type: PropTypes.string.isRequired,
	payload: PropTypes.any,
} );

const objectState = PropTypes.shape( {
	byId: PropTypes.object.isRequired,
	windows: PropTypes.any.isRequired,
	isLoading: PropTypes.bool.isRequired,
} );

export const WriteCommentsState = PropTypes.objectOf(
	PropTypes.shape( {
		isShowing: PropTypes.bool.isRequired,
		comment: Comment.isRequired,
	} ),
);

export const WritePostState = PropTypes.shape( {
	isShowing: PropTypes.bool.isRequired,
	post: Post.isRequired,
} );

export const PostsState = PropTypes.shape( {
	byId: PropTypes.objectOf( Post ).isRequired,
	isLoading: PropTypes.bool.isRequired,
	windows: PropTypes.objectOf( WindowState ).isRequired,
	relations: PropTypes.objectOf(
		PropTypes.shape( {
			items: PropTypes.arrayOf( PropTypes.number ),
			isLoading: PropTypes.bool.isRequired,
			hasLoaded: PropTypes.bool.isRequired,
		} )
	).isRequired,
} );

export const UsersState = PropTypes.shape( {
	byId: PropTypes.objectOf( User ).isRequired,
	isLoading: PropTypes.bool.isRequired,
} );

export const CommentsState = PropTypes.shape( {
	byId: PropTypes.objectOf( Comment ).isRequired,
	isLoading: PropTypes.bool.isRequired,
} );

export const State = PropTypes.shape( {
	users: UsersState.isRequired,
	posts: PostsState.isRequired,
	comments: CommentsState.isRequired,
	categories: objectState.isRequired,
	tags: objectState.isRequired,
	writeComments: WriteCommentsState.isRequired,
} );

// (action: Action) => void
export const Dispatch = PropTypes.func;
