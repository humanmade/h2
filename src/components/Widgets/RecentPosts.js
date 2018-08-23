import { withArchive } from '@humanmade/repress';
import React from 'react';
import qs from 'qs';

import LinkButton from '../LinkButton';
import Link from '../RelativeLink';
import { posts } from '../../types';

import './RecentPosts.css';

class PostList extends React.Component {
	render() {
		if ( this.props.loading ) {
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
								<span
									dangerouslySetInnerHTML={ { __html: post.title.rendered } }
								/>
							</Link>
						</li>
					) ) }
				</ul>

				<div className="RecentPosts-pagination">
					{ hasNext && (
						<div className="RecentPosts-pagination-older">
							<LinkButton
								className="cta cta--small cta--arrow-left"
								onClick={ this.props.onNext }
							>Older</LinkButton>
						</div>
					) }
					{ hasPrevious && (
						<div className="RecentPosts-pagination-newer">
							<LinkButton
								className="cta cta--small cta--arrow"
								onClick={ this.props.onPrevious }
							>Newer</LinkButton>
						</div>
					) }
				</div>
			</div>
		);
	}
}

const mapPropsToArchive = props => {
	const args = {
		per_page: props.per_page,
		page: props.page,
	};

	const id = qs.stringify( args );
	posts.registerArchive( id, args );
	return id;
};

const ConnectedPostList = withArchive( posts, state => state.posts, mapPropsToArchive )( PostList );

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
