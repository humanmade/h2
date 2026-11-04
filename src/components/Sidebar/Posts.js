import { withPagedArchive } from '@humanmade/repress';
import qs from 'qs';
import React, { useState } from 'react';
import { NavLink as InternalLink } from 'react-router-dom';

import { posts } from '../../types';
import { decodeEntities } from '../../util';
import FormattedDate from '../FormattedDate';

import Chevron from './Chevron';
import Pagination from './Pagination';

function PostList( props ) {
	if ( props.loading || props.loadingMore ) {
		return <p>Loading…</p>;
	}

	if ( ! props.posts ) {
		return <p>Error: No recent posts found!</p>;
	}

	const hasNext = props.hasMore;
	const hasPrevious = props.page > 1;

	return (
		<div className="">
			<ul className="Sidebar-navigation">
				{ props.posts.map( post => (
					<li key={ post.id }>
						<InternalLink
							exact
							activeClassName="is-active"
							className="Sidebar-link"
							to={ post.link.replace( window.H2Data.site.home, '' ) }
						>
							<div>
								<span className="block">{ decodeEntities( post.title.rendered ) }</span>
								{ Object.prototype.hasOwnProperty.call( post, 'date' ) && (
									<span className="block mt-1 opacity-60 text-xs text-gray-600">
										<FormattedDate
											date={ post.date + 'Z' }
										/>
									</span>
								) }
							</div>
							<Chevron />
						</InternalLink>
					</li>
				) ) }
			</ul>

			<Pagination
				hasNext={ hasNext }
				hasPrevious={ hasPrevious }
				onNext={ props.onNext }
				onPrevious={ props.onPrevious }
			/>
		</div>
	);
}

const mapPropsToArchive = props => {
	const args = {
		per_page: props.per_page || 10,
	};

	const id = qs.stringify( args );
	posts.registerArchive( id, args );
	return id;
};

const ConnectedPostList = withPagedArchive( posts, state => state.posts, mapPropsToArchive )( PostList );

export default function RecentPosts( props ) {
	const { number } = props;
	const [ page, setPage ] = useState( 1 );

	return (
		<div className="Sidebar-inline-content">
			<div>
				<InternalLink
					exact
					activeClassName="is-active"
					className="Sidebar-link"
					to="/"
				>
						View all
					<Chevron />
				</InternalLink>
			</div>
			<ConnectedPostList
				page={ page }
				per_page={ number }
				onNext={ () => setPage( page + 1 ) }
				onPrevious={ () => setPage( page - 1 ) }
			/>
		</div>
	);
}
