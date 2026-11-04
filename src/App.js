import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import {
	heartbeat,
	hideSidebar,
	hideSuperSidebar,
	showSuperSidebar,
} from './actions';
import Changes from './components/Changes';
import Header from './components/Header';
import { OverlayContainer } from './components/Overlay';
import PageContainer from './components/Page/Container';
import PostsList from './components/Post/List';
import WritePost from './components/Post/Write';
import Profile from './components/Profile';
import SessionExpiredWarning from './components/SessionExpiredWarning';
import Sidebar from './components/Sidebar';
import CategoriesSidebar from './components/Sidebar/Categories';
import CommentsSidebar from './components/Sidebar/Comments';
import PagesSidebar from './components/Sidebar/Pages';
import PostsSidebar from './components/Sidebar/Posts';
import SuperOverlay from './components/Super';
import UserPage from './components/User';
import { RenderPlugins } from './plugins';
import { posts } from './types';

import './App.css';

// Matches the breakpoint in App.css where the sidebar becomes a drawer.
const isDrawerLayout = () => window.matchMedia( '(max-width: 799px)' ).matches;

export const POST_ROUTE = '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug/:comment_page(comment-page-\\d+)?';

class App extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			isShowingWritePost: false,
			isSidebarOpen: false,
			showChanges: false,
		};
		this.headerRef = React.createRef();
	}
	onLogOut() {
		window.location.href = '/wp-login.php?action=logout';
	}

	componentDidUpdate( prevProps, prevState ) {
		// On small screens the sidebar is a drawer; reveal it when a section is requested.
		if ( this.props.sidebarView && this.props.sidebarView !== prevProps.sidebarView && ! this.state.isSidebarOpen && isDrawerLayout() ) {
			this.setState( { isSidebarOpen: true } );
		}

		if ( prevState.isSidebarOpen !== this.state.isSidebarOpen ) {
			document.body.classList.toggle( 'h2-sidebar-open', this.state.isSidebarOpen );
		}

		// Scroll back to top when navigating to a new page.
		if ( prevProps.location && this.props.location && prevProps.location !== this.props.location ) {
			window.scrollTo( { top: 0 } );
			this.props.onHeartbeat();
		}
	}

	componentDidMount() {
		document.addEventListener( 'keydown', this.onKeyDown );
		this.unsubscribeFromHistory = this.props.history.listen( this.handleLocationChange );
		this.props.onHeartbeat();
	}

	componentWillUnmount() {
		document.removeEventListener( 'keydown', this.onKeyDown );
		document.body.classList.remove( 'h2-sidebar-open' );
		window.clearTimeout( this.sidebarResetTimer );
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

		if ( this.state.isSidebarOpen ) {
			this.onCloseSidebar();
		}
	}

	onKeyDown = e => {
		if ( e.key === 'Escape' && this.state.isSidebarOpen ) {
			this.onCloseSidebar();
		}
	}

	onToggleSidebar = () => {
		this.setState( state => ( { isSidebarOpen: ! state.isSidebarOpen } ) );
	}

	onCloseSidebar = () => {
		this.setState( { isSidebarOpen: false } );

		// Return the drawer to the main menu once it has slid away, so the
		// next section request (e.g. the same profile again) reopens it.
		window.clearTimeout( this.sidebarResetTimer );
		this.sidebarResetTimer = window.setTimeout( () => {
			if ( ! this.state.isSidebarOpen && this.props.sidebarView ) {
				this.props.onDismissSidebar();
			}
		}, 250 );
	}

	onToggleSuper = () => {
		if ( this.props.showingSuper ) {
			this.props.onHideSuperSidebar();
		} else {
			this.props.onShowSuperSidebar();
		}
	}

	onShowChanges = () => {
		this.setState( { showChanges: true } );
		this.props.onHideSuperSidebar();
	}

	onClickWritePost() {
		this.setState( { isShowingWritePost: true } );
	}

	onCancelWritePost() {
		this.setState( { isShowingWritePost: false } );
	}

	onDidCreatePost() {
		this.setState( { isShowingWritePost: false } );
		this.props.history.push( '/' );
		this.props.onRefreshPostStream();
	}

	renderSidebar() {
		switch ( this.props.sidebarView ) {
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

			case 'categories':
				return (
					<CategoriesSidebar
						onClose={ this.props.onDismissSidebar }
					/>
				);

			case 'pages':
				return (
					<PagesSidebar
						onClose={ this.props.onDismissSidebar }
					/>
				);

			case 'posts':
				return (
					<PostsSidebar
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
				{ /* Keep the header above the overlay, so its search input stays usable. */ }
				<div
					ref={ this.headerRef }
					className={ this.props.showingSuper ? 'relative z-30' : undefined }
				>
					<Header
						superActive={ this.props.showingSuper }
						onLogOut={ () => this.onLogOut() }
						onWritePost={ () => this.onClickWritePost() }
						sidebarOpen={ this.state.isSidebarOpen }
						onShowSuper={ this.onToggleSuper }
						onToggleSidebar={ this.onToggleSidebar }
					/>
				</div>
				{ this.props.showingSuper && (
					<SuperOverlay
						headerRef={ this.headerRef }
						onShowChanges={ this.onShowChanges }
					/>
				) }
				<SessionExpiredWarning />
				<div className="Outer grid grid-cols-[min(30%,360px)_auto] gap-0">
					<div
						className={ this.state.isSidebarOpen ? 'App-sidebar App-sidebar--open' : 'App-sidebar' }
						id="h2-sidebar"
					>
						<button
							aria-label="Close menu"
							className="App-sidebar__close"
							type="button"
							onClick={ this.onCloseSidebar }
						>
							<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
								<path d="M3 3l10 10M13 3 3 13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
							</svg>
						</button>
						{ this.renderSidebar() }
					</div>
					{ this.state.isSidebarOpen && (
						<button
							aria-label="Close menu"
							className="App-sidebar-backdrop"
							tabIndex="-1"
							type="button"
							onClick={ this.onCloseSidebar }
						/>
					) }
					<div className="Inner min-w-0 max-w-200 px-8 max-[600px]:px-4">
						{ this.state.isShowingWritePost ? (
							<WritePost
								onDidCreatePost={ post => this.onDidCreatePost( post ) }
								onCancel={ () => this.onCancelWritePost() }
							/>
						) : null }

						<Switch>
							<Route
								path="/write"
								exact
								render={ () => (
									<WritePost
										onDidCreatePost={ post => this.onDidCreatePost( post ) }
									/>
								) }
							/>
							<Route
								path="/author/:authorSlug/:view(comments)?/:hasPage(page)?/:page(\d+)?"
								exact
								component={ UserPage }
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
		onHeartbeat: () => dispatch( heartbeat ),
		onDismissSidebar: () => dispatch( hideSidebar() ),
		onHideSuperSidebar: () => dispatch( hideSuperSidebar() ),
		onShowSuperSidebar: () => dispatch( showSuperSidebar() ),
		onRefreshPostStream: () => dispatch( posts.fetchArchive( '' ) ),
	};
};

export default withRouter(
	connect( mapStateToProps, mapDispatchToProps )( App )
);
