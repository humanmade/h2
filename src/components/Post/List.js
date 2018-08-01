import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ContentLoader from 'react-content-loader';
import { connect } from 'react-redux';
import qs from 'qs';

import Button from '../Button';
import PostComponent from './index';
import { setDefaultPostView } from '../../actions';
import { withApiData } from '../../with-api-data';

import './List.css';

class PostsList extends Component {
	render() {
		const { defaultPostView, summaryEnabled } = this.props;
		const { page } = this.props.match.params;

		return (
			<div className="PostsList">
				{ this.props.posts.isLoading &&
					<ContentLoader type="list" width={ 300 } />
				}
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
				<div className="pagination">
					<Link to={ `/page/${ page ? Number( page ) + 1 : 2 }` }>Older</Link>
					{ page && page > 1 ? (
						<Link to={ `/page/${ page - 1 }` }>Newer</Link>
					) : (
						/* Hack to get pagination to float correctly */
						/* eslint-disable-next-line jsx-a11y/anchor-is-valid */
						<a style={ { display: 'none' } }>&nbsp;</a>
					) }
				</div>
			</div>
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
