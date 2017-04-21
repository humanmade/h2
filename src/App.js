// @flow
import React, { Component } from 'react';
import { fetchPosts } from './actions';
import { connect } from 'react-redux';
import Header from './components/Header';
import Logo from './components/Logo';
import './App.css';

import PostsList from './components/PostsList';

class App extends Component {
	componentWillMount() {
		this.props.dispatch(fetchPosts({ _embed: true, per_page: 20 }));
	}
	render() {
		return (
			<div className="App">
				<Header><Logo /></Header>
				<PostsList
					posts={Object.values(this.props.posts.byId)}
					users={this.props.users.byId}
				/>
			</div>
		);
	}
}

export default connect(s => s)(App);
