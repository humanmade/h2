// @flow
import React, { Component } from 'react';
import { fetchPosts } from './actions';
import { connect } from 'react-redux';
import Header from './components/Header';
import './App.css';

import PostsList from './components/PostsList';

class App extends Component {
	componentWillMount() {
		this.props.dispatch(fetchPosts({ _embed: true, per_page: 20 }));
	}
	render() {
		return (
			<div className="App">
				<Header />
				<div className="Inner">
					<PostsList
						posts={Object.values(this.props.posts.byId)}
					/>
				</div>
			</div>
		);
	}
}

export default connect(s => s)(App);
