import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'qs';

import Loader from './Loader';
import Button from '../Button';
import PageTitle from '../PageTitle';
import Pagination from '../Pagination';
import PostComponent from './index';
import { setDefaultPostView } from '../../actions';
import { withApiData } from '../../with-api-data';

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

		const isSingular = !! this.props.match.params.slug;
		const getTitle = () => {
			if ( this.props.match.params.search ) {
				return `Search Results for “${ this.props.match.params.search }”`;
			}

			if ( ! isSingular ) {
				// Use default title.
				return null;
			}

			if ( this.props.posts.isLoading ) {
				return 'Loading…';
			}

			if ( ! this.props.posts.data || ! this.props.posts.data[0] ) {
				return 'Not Found';
			}

			return this.props.posts.data[0].title.rendered;
		}

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
					{ this.props.posts.isLoading && (
						<React.Fragment>
							{/* Dummy div to measure width */}
							<div ref={ this.onUpdateWidth } />

							{ /* Show two faux posts loading */ }
							<Loader width={ this.state.containerWidth } />
							<Loader width={ this.state.containerWidth } />
						</React.Fragment>
					) }
					{ this.props.posts.data &&
						this.props.posts.data.map( post => (
							<PostComponent
								key={ post.id }
								data={ post }
								expanded={ ! summaryEnabled || defaultPostView === 'expanded' }
								onInvalidate={ () => this.props.invalidateData() }
							/>
						) )
					}
					<Pagination
						params={ this.props.match.params }
						path={ this.props.match.path }
					/>
				</div>
			</PageTitle>
		);
	}
}

const mapStateToProps = state => ( {
	defaultPostView: state.ui.defaultPostView,
	summaryEnabled: state.features.summary_view,
} );

const mapDispatchToProps = dispatch => ( {
	setDefaultPostView: view => dispatch( setDefaultPostView( view ) ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( withApiData( props => ( {
	categories: props.match.params.categorySlug ? '/wp/v2/categories' : null,
	users: props.match.params.authorSlug ? '/wp/v2/users?per_page=100' : null,
} ) )( withApiData( props => {
	const filters = {};
	if ( props.match.params.page ) {
		filters.page = props.match.params.page;
	}
	if ( props.match.params.slug ) {
		filters.slug = props.match.params.slug;
	}
	if ( props.match.params.search ) {
		filters.search = props.match.params.search;
	}
	if ( props.match.params.categorySlug && props.categories.data ) {
		const category = props.categories.data.filter( category => category.slug === props.match.params.categorySlug )[0];
		filters.categories = [ category.id ];
	}

	if ( props.match.params.authorSlug && props.users.data ) {
		const user = props.users.data.filter( user => user.slug === props.match.params.authorSlug )[0];
		filters.author = user.id;
	}

	let postsRoute = '/wp/v2/posts';
	if ( Object.keys( filters ).length > 0 ) {
		postsRoute += '?' + qs.stringify( filters );
	}

	return { posts: postsRoute };
} )( PostsList ) ) );
