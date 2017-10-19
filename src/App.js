import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchPosts, fetchUsers, fetchUser, fetchReplies, fetchCategories } from './actions';
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
			<div className="Outer">
				<div className="Inner">
					{this.props.writePost.isShowing ? <WritePost /> : null}
					{this.props.posts.windows.feed.lastError
						? this.props.posts.windows.feed.lastError.message
						: <PostsList />}
				</div>
				<aside className="Sidebar">
					<div className="widget">
						<h2>Hangouts</h2>
						<h3>Team Hangout</h3>
						<p>Every second Thursday, 01:30 BST & 16:30 BST</p>
						<p>Every second Friday, 21:00 BST</p>

						<h3>Agency Hangout</h3>
						<p>Tuesday, 15:00 BST</p>

						<h3>Resourcing Call</h3>
						<p>Alternating every week - Thursday, 09:00 BST and 16:00 BST</p>

						<h3>Hiring Call</h3>
						<p>Monday, 12:00 BST</p>
					</div>
				</aside>
			</div>
		</div>;
	}
}

export default connect( s => s )( App );
