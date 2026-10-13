import { withPagedArchive } from '@humanmade/repress';
import qs from 'qs';
import React, { useState } from 'react';
import { Link as InternalLink } from 'react-router-dom';

import { posts } from '../../types';
import { decodeEntities } from '../../util';
import FormattedDate from '../FormattedDate';
import Link from '../Link';

import Container from './Container';
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
			<ul className="border-hm-beige/50 divide-y divide-hm-beige/50">
				{ props.posts.map( post => (
					<li key={ post.id }>
						<Link
							className="group grid grid-cols-[auto_min-content] px-4 py-2 text-sm hover:bg-hm-beige/20 hover:no-underline!"
							href={ post.link }
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
							<span className="transition-transform group-hover:translate-x-2">
								&rarr;
							</span>
						</Link>
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
		<Container
			title="Posts"
			onClose={ props.onClose }
		>
			<div className="-mx-6 -mt-4">
				<div className="border-b-2 border-hm-beige/50 mb-2">
					<InternalLink
						className="group grid grid-cols-[auto_min-content] px-4 py-2 text-sm hover:bg-hm-beige/20 hover:no-underline!"
						to="/"
					>
						View all
						<span className="transition-transform group-hover:translate-x-2">
							&rarr;
						</span>
					</InternalLink>
				</div>
				<ConnectedPostList
					page={ page }
					per_page={ number }
					onNext={ () => setPage( page + 1 ) }
					onPrevious={ () => setPage( page - 1 ) }
				/>
			</div>
		</Container>
	);
}
