import React, { Component } from 'react';
import { connect } from 'react-redux';

import api from './api';

import Header from './components/Header';
import PostsList from './components/PostsList';
import WritePost from './containers/WritePost';

import './App.css';

class App extends Component {
	componentWillMount() {
		if ( api.config.credentials ) {
			api.restoreCredentials().authorize().then( () => {
				api.saveCredentials();
			} );
		}
	}

	onLogOut() {
		api.removeCredentials();
		window.location.reload();
	}

	onWriteStatus() {}

	onWritePost() {
		this.props.dispatch( { type: 'SHOW_WRITE_POST' } );
	}

	render() {
		return <div className="App">
			<Header
				onLogOut={ () => this.onLogOut() }
				onWriteStatus={() => this.onWriteStatus()}
				onWritePost={() => this.onWritePost()}
				onSearch={search => this.onSearch( search )}
			/>
			<div className="Inner">
				{this.props.writePost.isShowing ? <WritePost /> : null}
				<PostsList />
			</div>
		</div>;
	}
}

export default connect( s => s )( App );
