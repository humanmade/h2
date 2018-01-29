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
			<div className="Inner">
				{this.state.isShowingWritePost ? <WritePost onDidCreatePost={ post => this.onDidCreatePost( post )} onCancel={() => this.onCancelWritePost()} /> : null}
				<Route path="/" exact component={PostsList} />
				<Route path="/author/:authorSlug" exact component={PostsList} />
				<Route path="/category/:categorySlug" exact component={PostsList} />
				<Route path="/page/:page" exact component={PostsList} />
				<Route path="/search/:search" exact component={PostsList} />
				<Route path="/:slug" exact component={PostsList} />
			</div>
		</div>;
	}
}

export default withRouter( connect( s => s )( App ) );
