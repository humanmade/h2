import PropTypes from 'prop-types';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import PostComponent from '../containers/Post';
import { Post } from '../shapes';

import { withApiData } from '../with-api-data';

import './PostsList.css';

function PostsList( props ) {
	return <div className="PostsList">
		<InfiniteScroll
			next={ props.onLoadMore }
			hasMore={ false }
			loader={<h4>Loading...</h4>}
			style={{ overflow: 'inherit' }}
		>
			{props.posts.data &&
				props.posts.data.map( post => <PostComponent key={post.id} post={post} /> )
			}
		</InfiniteScroll>

	</div>;
}

PostsList.propTypes = {
	hasMore:    PropTypes.bool.isRequired,
	posts:      PropTypes.arrayOf( Post ).isRequired,
	onLoadMore: PropTypes.func.isRequired,
};

export default withApiData( props => ( { posts: '/wp/v2/posts' } ) )( PostsList );
