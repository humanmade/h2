import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import Header from './components/Header';
import PostsList from './components/PostsList';
import WritePost from './components/WritePost';

import './App.css';

class App extends Component {
	constructor( props ) {
		super( props );
		this.state = { isShowingWritePost: false };
	}
	onLogOut() {
		window.location.href = '/wp-login.php?action=logout'
	}

	onClickWritePost() {
		this.setState( { isShowingWritePost: true } )
	}

	onCancelWritePost() {
		this.setState( { isShowingWritePost: false } )
	}

	onSearch( string ) {
		this.props.history.push( string ? `/search/${ string }` : '/' );
	}

	onDidCreatePost( post ) {
		this.setState({ isShowingWritePost: false })
		this.props.history.push( post.link.replace( /^(?:\/\/|[^/]+)*\//, '/' ) );
	}

	render() {
		return <div className="App">
			<Header
				onLogOut={ () => this.onLogOut() }
				onWritePost={() => this.onClickWritePost()}
				onSearch={search => this.onSearch( search )}
			/>
			<div className="Outer">
				<div className="Inner">
					{this.state.isShowingWritePost ? <WritePost onDidCreatePost={ post => this.onDidCreatePost( post )} onCancel={() => this.onCancelWritePost()} /> : null}
					<Route path="/" exact component={PostsList} />
					<Route path="/author/:authorSlug" exact component={PostsList} />
					<Route path="/category/:categorySlug" exact component={PostsList} />
					<Route path="/page/:page" exact component={PostsList} />
					<Route path="/search/:search" exact component={PostsList} />
					<Route path="/:year/:month/:day/:slug" exact component={PostsList} />
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

export default withRouter( connect( s => s )( App ) );
