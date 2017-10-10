import PropTypes from 'prop-types';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import PostComponent from '../containers/Post';
import { Post } from '../shapes';

import './PostsList.css';

export default function PostsList( props ) {
	return <div className="PostsList">
		<InfiniteScroll
			next={props.onLoadMore}
			hasMore={props.hasMore}
			loader={<h4>Loading...</h4>}
			style={{ overflow: 'inherit' }}
		>
			{props.posts.map(post => <PostComponent key={post.id} post={post} />)}
		</InfiniteScroll>

	</div>;
}

PostsList.propTypes = {
	hasMore: PropTypes.bool.isRequired,
	posts: PropTypes.arrayOf( Post ).isRequired,
	onLoadMore: PropTypes.func.isRequired,
};
