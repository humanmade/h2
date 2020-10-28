import { withPagedArchive } from '@humanmade/repress';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'qs';

import Loader from './Loader';
import Button from '../Button';
import PageTitle from '../PageTitle';
import Pagination from '../Pagination';
import PostComponent from './index';
import { setDefaultPostView } from '../../actions';
import { withCategories, withUsers } from '../../hocs';
import { posts } from '../../types';
import { decodeEntities } from '../../util';

import './List.css';

class PostsList extends Component {
	state = {
		containerWidth: 740,
	}

	onUpdateWidth = ref => {
		if ( ! ref ) {
			return;
		}

		this.setState( {
			containerWidth: ref.clientWidth,
		} );
	}

	render() {
		const { defaultPostView, summaryEnabled } = this.props;
		if ( this.props.loading || this.props.loadingMore ) {
			return (
				<PageTitle title="Loading…">
					<div className="PostsList">
						{ /* Dummy div to measure width */ }
						<div ref={ this.onUpdateWidth } />

						{ /* Show two faux posts loading */ }
						<Loader width={ this.state.containerWidth } />
						<Loader width={ this.state.containerWidth } />
					</div>
				</PageTitle>
			);
		}
		if ( ! this.props.posts || ! this.props.posts[0] ) {
			return (
				<PageTitle title="Not Found">
					<div className="PostsList">
						Error
					</div>
				</PageTitle>
			);
		}

		const isSingular = !! this.props.match.params.slug;
		const getTitle = () => {
			if ( this.props.match.params.search ) {
				return `Search Results for “${ this.props.match.params.search }”`;
			}

			if ( ! isSingular ) {
				// Use default title.
				return null;
			}

			return decodeEntities( this.props.posts[0].title.rendered );
		};

		return (
			<PageTitle title={ getTitle() }>
				<div className="PostsList">
					{ summaryEnabled ? (
						<div className="PostsList--settings">
							<Button
								disabled={ defaultPostView === 'summary' }
								onClick={ () => this.props.setDefaultPostView( 'summary' ) }
							>
								Summary
							</Button>
							<Button
								disabled={ defaultPostView === 'expanded' }
								onClick={ () => this.props.setDefaultPostView( 'expanded' ) }
							>
								Expanded
							</Button>
						</div>
					) : (
						/* Dummy settings div to ensure markup matches */
						<div className="PostsList--settings" />
					) }
					{ this.props.posts && this.props.posts.map( post => (
						<PostComponent
							key={ post.id }
							data={ post }
							viewMode={ isSingular ? 'full' : this.props.viewMode }
							expanded={ isSingular || ! summaryEnabled || defaultPostView === 'expanded' }
							onInvalidate={ () => this.props.invalidateData() }
						/>
					) ) }
					<Pagination
						hasNext={ this.props.hasMore }
						params={ this.props.match.params }
						path={ this.props.match.path }
					/>
				</div>
			</PageTitle>
		);
	}
}

const getPage = props => Number( props.match.params.page || 1 );

const ConnectedPostsList = withPagedArchive(
	posts,
	state => state.posts,
	props => {
		const filters = {};
		const querystring = qs.parse( props.location.search, { ignoreQueryPrefix: true } );

		// Post previews.
		if ( querystring.preview && querystring.p ) {
			filters.include = [ querystring.p ];
			filters.status = 'draft';
		}

		if ( props.match.params.slug ) {
			filters.slug = props.match.params.slug;
		}
		if ( props.match.params.search ) {
			filters.search = props.match.params.search;
		}
		if ( props.match.params.categorySlug && props.categories.data ) {
			const matchingCategories = props.categories.data.filter( category => {
				const expected = `${ window.H2Data.site.home }/category/${ props.match.params.categorySlug }/`;
				return category.link === expected;
			} );
			if ( matchingCategories.length ) {
				filters.categories = [ matchingCategories[0].id ];
			} else {
				// Force the category not to match.
				filters.categories = [ 0 ];
			}
		}

		if ( props.match.params.authorSlug && props.users ) {
			const user = props.users.filter( user => user.slug === props.match.params.authorSlug )[0];
			filters.author = user.id;
		}

		const id = qs.stringify( filters );
		posts.registerArchive( id, filters );
		return id;
	},
	{
		getPage,
	}
)( PostsList );

const MoreConnectedPostsList = withUsers( ConnectedPostsList );

const mapStateToProps = state => {
	const currentUser = state.users.posts.find( user => state.users.current === user.id );

	return {
		defaultPostView: state.ui.defaultPostView,
		summaryEnabled: state.features.summary_view,
		viewMode: currentUser ? currentUser.meta.h2_view_preference : 'compact',
	};
};

const mapDispatchToProps = dispatch => ( {
	setDefaultPostView: view => dispatch( setDefaultPostView( view ) ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( withCategories( MoreConnectedPostsList ) );
