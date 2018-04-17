import PropTypes from 'prop-types';

export const Post = PropTypes.shape( {
	title: PropTypes.shape( {
		rendered: PropTypes.string.isRequired,
		edited:   PropTypes.string,
	} ).isRequired,
	content: PropTypes.shape( {
		rendered: PropTypes.string.isRequired,
		raw:      PropTypes.string,
		edited:   PropTypes.string,
	} ).isRequired,
	author:   PropTypes.number.isRequired,
	id:       PropTypes.number.isRequired,
	date_gmt: PropTypes.string.isRequired,
	related:  PropTypes.shape( {
		comments: PropTypes.shape( {
			items:     PropTypes.arrayOf( PropTypes.number ).isRequired,
			isLoading: PropTypes.bool.isRequired,
			hasLoaded: PropTypes.bool.isRequired,
		} ).isRequired,
	} ),
} );

export const User = PropTypes.shape( {
	id:          PropTypes.number.isRequired,
	name:        PropTypes.string.isRequired,
	avatar_urls: PropTypes.shape( { '96': PropTypes.string.isRequired } ).isRequired,
} );

export const Category = PropTypes.shape( {
	id:   PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired,
} );

export const WindowState = PropTypes.shape( {
	items:        PropTypes.arrayOf( PropTypes.number ).isRequired,
	totalObjects: PropTypes.number,
	totalPages:   PropTypes.number,
	isLoading:    PropTypes.bool,
} );

export const Comment = PropTypes.shape( {
	id:      PropTypes.number.isRequired,
	content: PropTypes.shape( {
		rendered: PropTypes.string.isRequired,
		raw:      PropTypes.string,
		edited:   PropTypes.object,
	} ).isRequired,
	author: PropTypes.number.isRequired,
	post:   PropTypes.number.isRequired,
} );

export const Action = PropTypes.shape( {
	type:    PropTypes.string.isRequired,
	payload: PropTypes.any,
} );

const objectState = PropTypes.shape( {
	byId:      PropTypes.object.isRequired,
	windows:   PropTypes.any.isRequired,
	isLoading: PropTypes.bool.isRequired,
} );

export const WriteCommentsState = {
	posts: PropTypes.objectOf(
		PropTypes.shape( {
			isShowing: PropTypes.bool.isRequired,
			comment:   Comment.isRequired,
		} ),
	),
	comments: PropTypes.objectOf(
		PropTypes.shape( {
			isShowing: PropTypes.bool.isRequired,
			comment:   Comment.isRequired,
		} ),
	),
};

export const WritePostState = PropTypes.shape( {
	isShowing: PropTypes.bool.isRequired,
	post:      Post.isRequired,
} );

export const PostsState = PropTypes.shape( {
	byId:      PropTypes.objectOf( Post ).isRequired,
	isLoading: PropTypes.bool.isRequired,
	windows:   PropTypes.objectOf( WindowState ).isRequired,
	relations: PropTypes.objectOf(
		PropTypes.shape( {
			items:     PropTypes.arrayOf( PropTypes.number ),
			isLoading: PropTypes.bool.isRequired,
			hasLoaded: PropTypes.bool.isRequired,
		} )
	).isRequired,
} );

export const UsersState = PropTypes.shape( {
	byId:      PropTypes.objectOf( User ).isRequired,
	isLoading: PropTypes.bool.isRequired,
} );

export const CommentsState = PropTypes.shape( {
	byId:      PropTypes.objectOf( Comment ).isRequired,
	isLoading: PropTypes.bool.isRequired,
} );

export const CategoriesState = PropTypes.shape( {
	byId:      PropTypes.objectOf( Category ).isRequired,
	isLoading: PropTypes.bool.isRequired,
} );

export const Reaction = PropTypes.shape( {
	id:     PropTypes.number,
	type:   PropTypes.string.isRequired,
	author: PropTypes.number.isRequired,
	postId: PropTypes.number.isRequired,
} );

export const ReactionsState = PropTypes.shape( {
	byId:            PropTypes.objectOf( Reaction ).isRequired,
	loadingForPosts: PropTypes.array.isRequired,
} );

export const State = PropTypes.shape( {
	users:      UsersState.isRequired,
	posts:      PostsState.isRequired,
	comments:   CommentsState.isRequired,
	reactions:  ReactionsState.isRequired,
	categories: objectState.isRequired,
	tags:       objectState.isRequired,
} );

// (action: Action) => void
export const Dispatch = PropTypes.func;
