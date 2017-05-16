// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostsList from '../components/PostsList';
import type {
	PostsState,
	Dispatch,
} from '../types';
import { fetchPosts } from '../actions';

class ConnectedPostsList extends Component {
	props: {
		posts: PostsState,
		dispatch: Dispatch,
	};

	onLoadMore() {
		if (this.props.posts.isLoading) {
			return;
		}
		this.props.dispatch(
			fetchPosts({
				_embed: true,
				per_page: 1,
				page: this.props.posts.windows.feed.items.length + 1,
				order_by: 'date_gmt',
				order: 'desc',
			})
		);
	}
	render() {
		const posts = this.props.posts.windows.feed.items
			.map(id => this.props.posts.byId[id])
			.sort((a, b) => (a.date_gmt > b.date_gmt ? -1 : 1));
		return (
			<PostsList
				hasMore={
					!this.props.posts.windows.feed.totalObjects ||
						this.props.posts.windows.feed.totalObjects >
							this.props.posts.windows.feed.items.length
				}
				onLoadMore={() => this.onLoadMore()}
				posts={posts}
			/>
		);
	}
}

export default connect(s => s)(ConnectedPostsList);
