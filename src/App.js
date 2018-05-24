import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import {
	hideSidebarProfile,
	hideSuperSidebar,
	showSuperSidebar,
} from './actions';
import Changes from './components/Changes';
import Header from './components/Header';
import PostsList from './components/Post/List';
import WritePost from './components/Post/Write';
import MetaSidebar from './components/MetaSidebar';
import Profile from './components/Profile';
import Sidebar from './components/Sidebar';
import { RenderPlugins } from './plugins';

import SuperMenu from './components/SuperMenu';

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

	componentDidMount() {
		this.unsubscribeFromHistory = this.props.history.listen( loc => this.handleLocationChange( loc ) );
	}

	componentWillUnmount() {
		if ( this.unsubscribeFromHistory ) {
			this.unsubscribeFromHistory();
		}
	}

	handleLocationChange( location ) {
		// Don't change on in-page navigation.
		if ( location.pathname === this.props.location.pathname && location.search === this.props.location.search ) {
			return;
		}

		if ( this.props.showingSuper ) {
			this.props.onHideSuperSidebar();
		}
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
		const classes = [
			'App',
			this.props.showingSuper && 'App--showing-super',
		];
		return <div className={ classes.filter( Boolean ).join( ' ' ) }>
			<SuperMenu
				visible={ this.props.showingSuper }
				onClose={ this.props.onHideSuperSidebar }
			/>
			<Header
				onLogOut={ () => this.onLogOut() }
				onWritePost={ () => this.onClickWritePost() }
				onSearch={ search => this.onSearch( search ) }
				onShowChanges={ () => this.setState( { showChanges: true } ) }
				onShowSuper={ this.props.onShowSuperSidebar }
			/>
			<div className="Outer">
				<div className="Inner">
					{ this.state.isShowingWritePost ? (
						<WritePost
							onDidCreatePost={ post => this.onDidCreatePost( post ) }
							onCancel={ () => this.onCancelWritePost() }
						/>
					) : null }

					<Route path="/" exact component={ PostsList } />
					<Route path="/author/:authorSlug" exact component={ PostsList } />
					<Route path="/category/:categorySlug" exact component={ PostsList } />
					<Route path="/page/:page" exact component={ PostsList } />
					<Route path="/search/:search" exact component={ PostsList } />
					<Route path="/:year/:month/:day/:slug/:comment_page(comment-page-\d+)?" exact component={ PostsList } />
				</div>
				{ this.renderSidebar() }
			</div>
			{ this.state.showChanges ? (
				<Changes
					onDismiss={ () => this.setState( { showChanges: false } ) }
				/>
			) : null }

			<RenderPlugins />
		</div>;
	}
}

const mapStateToProps = state => {
	return {
		showingSuper: state.ui.showingSuper,
		sidebarProfile: state.ui.sidebarProfile,
		sidebarView: state.ui.sidebarView,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onDismissSidebarProfile: () => dispatch( hideSidebarProfile() ),
		onHideSuperSidebar: () => dispatch( hideSuperSidebar() ),
		onShowSuperSidebar: () => dispatch( showSuperSidebar() ),
	};
};

export default withRouter(
	connect( mapStateToProps, mapDispatchToProps )( App )
);
