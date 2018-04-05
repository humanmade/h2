import React from 'react';
import qs from 'qs';

import LinkButton from '../LinkButton';
import Link from '../RelativeLink';
import { withApiData } from '../../with-api-data';

import './RecentPosts.css';

function PostList( props ) {
	if ( props.posts.isLoading ) {
		return <p>Loading…</p>;
	}

	if ( props.posts.error ) {
		return <p>Error!</p>;
	}

	// TODO: Add proper pagination support:
	// https://github.com/joehoyle/with-api-data/issues/3
	// In the meantime, if we have less than the requested number, it's likely
	// that we don't have a next page.
	const hasNext = props.posts.data.length === props.per_page;
	const hasPrevious = props.page > 1;

	return (
		<div>
			<ul>
				{ props.posts.data.map( post => (
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
							onClick={ props.onNext }
						>Older</LinkButton>
					</div>
				) }
				{ hasPrevious && (
					<div className="RecentPosts-pagination-newer">
						<LinkButton
							className="cta cta--small cta--arrow"
							onClick={ props.onPrevious }
						>Newer</LinkButton>
					</div>
				) }
			</div>
		</div>
	);
}

const mapPropsToApi = props => {
	const args = {
		per_page: props.per_page,
		page:     props.page,
	};

	const posts = `/wp/v2/posts?${ qs.stringify( args ) }`;
	return { posts };
};

const ConnectedPostList = withApiData( mapPropsToApi )( PostList );

export default class RecentPosts extends React.Component {
	constructor( props ) {
		super( props );

		this.state = { page: 1 };
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
