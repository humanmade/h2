import { withArchive } from '@humanmade/repress';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ContentLoader from 'react-content-loader';
import qs from 'qs';

import PostComponent from './index';
import { withCategories } from '../../hocs';
import { posts, users } from '../../types';
import { withApiData } from '../../with-api-data';

import './List.css';

class PostsList extends Component {

	render() {
		// console.log( this.props.loading );
		if ( this.props.loading ) {
			return <div className="PostsList">
				<ContentLoader type="list" width={300} />
			</div>;
		}
		if ( ! this.props.posts ) {
			// console.log( 'received', { ...this.props } );
			return <div className="PostsList">
				Error
			</div>;
		}

		const { page } = this.props.match.params;

		return <div className="PostsList">
			{this.props.posts.map( post => (
				<PostComponent
					key={ post.id }
					data={ post }
				/>
			) ) }
			<div className="pagination">
				{ this.props.hasMore && (
					<Link to={`/page/${ page ? Number( page ) + 1 : 2 }`}>Older</Link>
				) }
				{ page && page > 1 ?
					<Link to={ `/page/${ page - 1 }` }>Newer</Link>
				:
					/* Hack to get pagination to float correctly */
					<a style={ { display: 'none' } } />
				}
			</div>
		</div>;
	}
}

const ConnectedPostsList = withArchive(
	posts,
	state => state.posts,
	props => {
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

		if ( props.match.params.authorSlug && props.users ) {
			const user = props.users.filter( user => user.slug === props.match.params.authorSlug )[0];
			filters.author = user.id;
		}

		const id = qs.stringify( filters );
		posts.registerArchive( id, filters );
		return id;
	}
)( PostsList );

const MoreConnectedPostsList = withArchive(
	users,
	state => state.users,
	'all',
	{
		mapDataToProps:    data => ( { users: data.posts } ),
		mapActionsToProps: () => ( {} ),
	}
)( ConnectedPostsList );

export default withCategories( MoreConnectedPostsList );
