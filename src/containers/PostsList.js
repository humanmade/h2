import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchPosts } from '../actions';
import PostsList from '../components/PostsList';
import {
	PostsState,
	Dispatch,
} from '../shapes';

class ConnectedPostsList extends Component {
	onLoadMore() {
		if ( this.props.posts.isLoading ) {
			return;
		}
		this.props.dispatch(
			fetchPosts( {
				_embed:   true,
				per_page: 1,
				page:     this.props.posts.windows.feed.items.length + 1,
				order_by: 'date_gmt',
				order:    'desc',
			} )
		);
	}
	render() {
		const posts = this.props.posts.windows.feed.items
			.map( id => this.props.posts.byId[id] )
			.sort( ( a, b ) => ( a.date_gmt > b.date_gmt ? -1 : 1 ) );
		return <PostsList
			hasMore={
				! this.props.posts.windows.feed.totalObjects ||
					this.props.posts.windows.feed.totalObjects >
						this.props.posts.windows.feed.items.length
			}
			onLoadMore={() => this.onLoadMore()}
			posts={posts}
		/>;
	}
}

ConnectedPostsList.propTypes = {
	dispatch: Dispatch.isRequired,
	posts:    PostsState.isRequired,
};

export default connect( s => s )( ConnectedPostsList );
