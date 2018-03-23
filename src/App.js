import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import { RenderPlugins } from './plugins'
import Changes from './components/Changes';
import Header from './components/Header';
import PostsList from './components/Post/List';
import WritePost from './components/Post/Write';
import Sidebar from './components/Sidebar';

import './App.css';

const getLastChangesView = () => {
	const viewed = window.localStorage.getItem( 'h2-last-change-view' );
	return viewed ? new Date( viewed ) : new Date( '1970-01-01' );
};

class App extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			isShowingWritePost: false,
			lastView: getLastChangesView(),
		};
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

	onDismissChanges = () => {
		const { lastView } = this.state;
		const now = new Date();
		this.setState( { lastView: now } );
		window.localStorage.setItem( 'h2-last-change-view', now.toISOString() );
	}

	render() {
		return <div className="App">
			<Header
				onLogOut={ () => this.onLogOut() }
				onWritePost={() => this.onClickWritePost()}
				onSearch={search => this.onSearch( search )}
				onShowChanges={ () => this.setState( { lastView: null } ) }
			/>
			<div className="Outer">
				<div className="Inner">
					{this.state.isShowingWritePost ? <WritePost onDidCreatePost={ post => this.onDidCreatePost( post )} onCancel={() => this.onCancelWritePost()} /> : null}
					<Route path="/" exact component={PostsList} />
					<Route path="/author/:authorSlug" exact component={PostsList} />
					<Route path="/category/:categorySlug" exact component={PostsList} />
					<Route path="/page/:page" exact component={PostsList} />
					<Route path="/search/:search" exact component={PostsList} />
					<Route path="/:year/:month/:day/:slug/:comment_page(comment-page-\d+)?" exact component={PostsList} />
				</div>
				<Sidebar />
			</div>
			<Changes
				lastView={ this.state.lastView }
				onDismiss={ this.onDismissChanges }
			/>

			<RenderPlugins />
		</div>;
	}
}

export default withRouter( connect( s => s )( App ) );
