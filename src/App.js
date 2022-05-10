import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import {
	hideSidebar,
	hideSuperSidebar,
	showSuperSidebar,
} from './actions';
import Changes from './components/Changes';
import Header from './components/Header';
import MetaSidebar from './components/MetaSidebar';
import { OverlayContainer } from './components/Overlay';
import PageContainer from './components/Page/Container';
import PostsList from './components/Post/List';
import WritePost from './components/Post/Write';
import Profile from './components/Profile';
import Sidebar from './components/Sidebar';
import CommentsSidebar from './components/Sidebar/Comments';
import SuperMenu from './components/SuperMenu';
import { RenderPlugins } from './plugins';

import './App.css';

export const POST_ROUTE = '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug/:comment_page(comment-page-\\d+)?';

class App extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			isShowingWritePost: false,
			showChanges: false,
		};
	}
	onLogOut() {
		window.location.href = '/wp-login.php?action=logout';
	}

	componentDidMount() {
		this.unsubscribeFromHistory = this.props.history.listen( this.handleLocationChange );
	}

	componentWillUnmount() {
		if ( this.unsubscribeFromHistory ) {
			this.unsubscribeFromHistory();
		}
	}

	handleLocationChange = location => {
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
		this.props.history.push( string ? `/search/${ encodeURIComponent( string ) }` : '/' );
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
						onClose={ this.props.onDismissSidebar }
						onLogOut={ () => this.onLogOut() }
					/>
				);

			case 'profile':
				return (
					<Profile
						id={ this.props.sidebarProfile }
						onClose={ this.props.onDismissSidebar }
					/>
				);

			case 'comments':
				return (
					<CommentsSidebar
						id={ this.props.sidebarProfile }
						onClose={ this.props.onDismissSidebar }
					/>
				);

			default:
				return <Sidebar />;
		}
	}

	render() {
		return (
			<div className="App">
				<OverlayContainer />
				<SuperMenu
					visible={ this.props.showingSuper }
					onClose={ this.props.onHideSuperSidebar }
					onSearch={ search => this.onSearch( search ) }
					onShowChanges={ () => {
						this.setState( { showChanges: true } );
						this.props.onHideSuperSidebar();
					} }
				/>
				<Header
					onLogOut={ () => this.onLogOut() }
					onWritePost={ () => this.onClickWritePost() }
					onSearch={ search => this.onSearch( search ) }
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

						<Switch>
							<Route
								path="/author/:authorSlug/:hasPage(page)?/:page(\d+)?"
								exact
								component={ PostsList }
							/>
							<Route
								path="/category/:categorySlug+/:hasPage(page)/:page(\d+)?"
								exact
								component={ PostsList }
							/>
							<Route
								path="/category/:categorySlug+"
								exact
								component={ PostsList }
							/>
							<Route
								path="/search/:search/:hasPage(page)?/:page(\d+)?"
								exact
								component={ PostsList }
							/>
							<Route
								path={ POST_ROUTE }
								exact
								component={ PostsList }
							/>
							<Route
								path="/:hasPage(page)?/:page(\d+)?"
								exact
								component={ PostsList }
							/>
							<Route
								path="/:pageName+"
								exact
								component={ PageContainer }
							/>
						</Switch>
					</div>
					{ this.renderSidebar() }
				</div>
				{ this.state.showChanges ? (
					<Changes
						onDismiss={ () => this.setState( { showChanges: false } ) }
					/>
				) : null }

				<RenderPlugins />
			</div>
		);
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
		onDismissSidebar: () => dispatch( hideSidebar() ),
		onHideSuperSidebar: () => dispatch( hideSuperSidebar() ),
		onShowSuperSidebar: () => dispatch( showSuperSidebar() ),
	};
};

export default withRouter(
	connect( mapStateToProps, mapDispatchToProps )( App )
);
