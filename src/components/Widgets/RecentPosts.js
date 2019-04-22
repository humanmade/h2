import { withPagedArchive } from '@humanmade/repress';
import React from 'react';
import qs from 'qs';

import Link from '../RelativeLink';
import Pagination from '../Sidebar/Pagination';
import { posts } from '../../types';
import { decodeEntities } from '../../util';

import './RecentPosts.css';

class PostList extends React.Component {
	render() {
		if ( this.props.loading || this.props.loadingMore ) {
			return <p>Loading…</p>;
		}

		if ( ! this.props.posts ) {
			return <p>Error!</p>;
		}

		const hasNext = this.props.hasMore;
		const hasPrevious = this.props.page > 1;

		return (
			<div>
				<ul>
					{ this.props.posts.map( post => (
						<li key={ post.id }>
							<Link to={ post.link }>
								{ decodeEntities( post.title.rendered ) }
							</Link>
						</li>
					) ) }
				</ul>

				<Pagination
					hasNext={ hasNext }
					hasPrevious={ hasPrevious }
					onNext={ this.props.onNext }
					onPrevious={ this.props.onPrevious }
				/>
			</div>
		);
	}
}

const mapPropsToArchive = props => {
	const args = {
		per_page: props.per_page,
	};

	const id = qs.stringify( args );
	posts.registerArchive( id, args );
	return id;
};

const ConnectedPostList = withPagedArchive( posts, state => state.posts, mapPropsToArchive )( PostList );

export default class RecentPosts extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			page: 1,
		};
	}

	render() {
		const { number, title } = this.props;

		return (
			<div className="RecentPosts">
				<h4>{ title || 'Recent Posts' }</h4>

				<ConnectedPostList
					page={ this.state.page }
					per_page={ number }
					onNext={ () => this.setState( state => ( { page: state.page + 1 } ) ) }
					onPrevious={ () => this.setState( state => ( { page: state.page - 1 } ) ) }
				/>
			</div>
		);
	}
}
