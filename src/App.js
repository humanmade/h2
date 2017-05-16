// @flow
import React, { Component } from 'react';
import { fetchPosts, fetchUsers, fetchUser } from './actions';
import { connect } from 'react-redux';
import Header from './components/Header';
import WritePost from './containers/WritePost';
import api from './api';
import './App.css';
import PostsList from './containers/PostsList';

class App extends Component {
	componentWillMount() {
		if (api.config.credentials) {
			api.restoreCredentials().authorize().then(() => {
				api.saveCredentials();
				this.props.dispatch(
					fetchPosts({
						_embed: true,
						per_page: 5,
						order_by: 'date_gmt',
						order: 'desc',
					})
				);
				this.props.dispatch(fetchUser(null));
				this.props.dispatch(fetchUsers({ per_page: 100 }));
			});
		} else {
			this.props.dispatch(
				fetchPosts({
					_embed: true,
					per_page: 5,
					order_by: 'date_gmt',
					order: 'desc',
				})
			);
			this.props.dispatch(fetchUsers({ per_page: 100 }));
		}
	}
	onWriteStatus() {}
	onWritePost() {
		this.props.dispatch({
			type: 'SHOW_WRITE_POST',
		});
	}
	render() {
		const currentUser = Object.values(this.props.user.byId).length > 0
			? Object.values(this.props.user.byId)[0]
			: null;
		return (
			<div className="App">
				<Header
					currentUser={currentUser}
					onWriteStatus={() => this.onWriteStatus()}
					onWritePost={() => this.onWritePost()}
				/>
				<div className="Inner">
					{this.props.writePost.isShowing ? <WritePost /> : null}
					{this.props.posts.windows.feed.lastError
						? this.props.posts.windows.feed.lastError.message
						: <PostsList />}
				</div>
			</div>
		);
	}
}

export default connect(s => s)(App);
