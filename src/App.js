import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import { hideSidebarProfile } from './actions';
import Changes from './components/Changes';
import Header from './components/Header';
import PostsList from './components/Post/List';
import WritePost from './components/Post/Write';
import MetaSidebar from './components/MetaSidebar';
import Profile from './components/Profile';
import Sidebar from './components/Sidebar';
import { RenderPlugins } from './plugins';

import './App.css';

class App extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			isShowingWritePost: false,
			showChanges: false,
		};
	}
	onLogOut() {
		window.location.href = '/wp-login.php?action=logout'
	}

	onClickWritePost() {
		this.setState( { isShowingWritePost: true } );
	}

	onCancelWritePost() {
		this.setState( { isShowingWritePost: false } );
	}

	onSearch( string ) {
		this.props.history.push( string ? `/search/${ string }` : '/' );
	}

	onDidCreatePost( post ) {
		this.setState( { isShowingWritePost: false } );
		this.props.history.push( post.link.replace( /^(?:\/\/|[^/]+)*\//, '/' ) );
	}

	renderSidebar() {
		switch ( this.props.sidebarView ) {
			case 'meta':
				return (
					<MetaSidebar
						onClose={ this.props.onDismissSidebarProfile }
						onLogOut={ () => this.onLogOut() }
					/>
				);

			case 'profile':
				return (
					<Profile
						id={ this.props.sidebarProfile }
						onClose={ this.props.onDismissSidebarProfile }
					/>
				);

			default:
				return <Sidebar />;
		}
	}

	render() {
		return <div className="App">
			<Header
				onLogOut={ () => this.onLogOut() }
				onWritePost={() => this.onClickWritePost()}
				onSearch={search => this.onSearch( search )}
				onShowChanges={ () => this.setState( { showChanges: true } ) }
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
				{ this.renderSidebar() }
			</div>
			<Changes
				forceShow={ this.state.showChanges }
				onDismiss={ () => this.setState( { showChanges: false } ) }
			/>

			<RenderPlugins />
		</div>;
	}
}

const mapStateToProps = state => {
	return {
		sidebarProfile: state.ui.sidebarProfile,
		sidebarView: state.ui.sidebarView,
	};
};

const mapDispatchToProps = dispatch => {
	return { onDismissSidebarProfile: () => dispatch( hideSidebarProfile() ) };
};

export default withRouter(
	connect( mapStateToProps, mapDispatchToProps )( App )
);
