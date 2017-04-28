// @flow
import React, { Component } from 'react';
import { fetchPosts, fetchUsers } from './actions';
import { connect } from 'react-redux';
import Header from './components/Header';
import api from './api';
import './App.css';

import PostsList from './components/PostsList';

class App extends Component {
	componentWillMount() {
		api.restoreCredentials().authorize().then(() => {
			api.saveCredentials();
			this.props.dispatch(fetchPosts({ _embed: true, per_page: 1 }));
			this.props.dispatch(fetchUsers({per_page: 100}));
		});
	}
	render() {
		return (
			<div className="App">
				<Header />
				<div className="Inner">
					<PostsList posts={Object.values(this.props.posts.byId)} />
				</div>
			</div>
		);
	}
}

export default connect(s => s)(App);
