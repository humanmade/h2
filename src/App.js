import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchPosts, fetchUsers, fetchUser, fetchReplies, fetchCategories, fetchReactions } from './actions';
import api from './api';
import store from './store';
import Header from './components/Header';
import PostsList from './containers/PostsList';
import WritePost from './containers/WritePost';

import './App.css';

class App extends Component {
	componentWillMount() {
		if ( api.config.credentials ) {
			api.restoreCredentials().authorize().then( () => {
				api.saveCredentials();
				this.props.dispatch(
					fetchPosts( {
						per_page: 10,
						order_by: 'date_gmt',
						order:    'desc',
					} )
				).then( response => {
					response.map( post => {
						return this.props.dispatch(
							fetchReplies( {
								per_page: 100,
								post:     post.id,
							} )
						);
					} );
					response.map( post => {
						return this.props.dispatch(
							fetchReactions( {
								per_page: 100,
								post:     post.id,
							} )
						);
					} );

				} );
				this.props.dispatch( fetchUser( null ) );
				this.props.dispatch( fetchUsers( { per_page: 100 } ) );
				this.props.dispatch( fetchCategories( { per_page: 100 } ) );
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

	onSearch( search ) {
		this.props.dispatch(
			store.actions.posts.windows.feed.updateFilter( { search } )
		);
		setTimeout( () => {
			this.props.dispatch(
				store.actions.posts.fetch( {
					...this.props.posts.windows.feed.filter,
					_embed: true,
				} )
			);
		}, 100 );
	}

	render() {
		const currentUser = Object.values( this.props.user.byId ).length > 0
			? Object.values( this.props.user.byId )[0]
			: null;
		return <div className="App">
			<Header
				currentUser={currentUser}
				onLogOut={ () => this.onLogOut() }
				onWriteStatus={() => this.onWriteStatus()}
				onWritePost={() => this.onWritePost()}
				onSearch={search => this.onSearch( search )}
				searchValue={this.props.posts.windows.feed.filter.search}
			/>
			<div className="Inner">
				{this.props.writePost.isShowing ? <WritePost /> : null}
				{this.props.posts.windows.feed.lastError
					? this.props.posts.windows.feed.lastError.message
					: <PostsList />}
			</div>
		</div>;
	}
}

export default connect( s => s )( App );
