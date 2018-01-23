import React from 'react';
import { Link } from 'react-router-dom';
import ContentLoader from 'react-content-loader'

import PostComponent from './Post';

import { withApiData } from '../with-api-data';

import './PostsList.css';

function PostsList( props ) {
	return <div className="PostsList">
		{props.posts.isLoading && <ContentLoader type="list" width={300} />}
		{props.posts.data &&
			props.posts.data.map( post => <PostComponent key={post.id} post={post} /> )
		}
		<Link to={`/page/${ props.match.params.page ? Number( props.match.params.page ) + 1 : 2 }`}>Older</Link>
	</div>;
}

export default withApiData( props => ( {
	posts: `/wp/v2/posts?page=${ props.match.params.page ? props.match.params.page : 1 }${ props.match.params.slug ? `&slug=${ props.match.params.slug }` : '' }${ props.match.params.search ? `&search=${ props.match.params.search }` : '' }`,
} ) )( PostsList );
