// @flow
import React from 'react';
import './PostsList.css';
import PostComponent from '../containers/Post';
import type { Post } from '../types';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function PostsList(
	props: {
		posts: Array<Post>,
		hasMore: Boolean,
		onLoadMore: () => void,
	}
) {
	return (
		<div className="PostsList">
			<InfiniteScroll
				next={props.onLoadMore}
				hasMore={props.hasMore}
				loader={<h4>Loading...</h4>}
				style={{ overflow: 'inherit' }}
			>
				{props.posts.map(post => <PostComponent key={post.id} post={post} />)}
			</InfiniteScroll>

		</div>
	);
}
