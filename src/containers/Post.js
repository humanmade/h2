import React, { Component } from 'react';
import { connect } from 'react-redux';

import CommentsList from '../components/CommentsList';
import Post from '../components/Post';
import {
	Post as PostShape,
	Dispatch,
	WriteCommentsState,
	CategoriesState,
} from '../shapes';

import { withApiData } from '../with-api-data';

class ConnectedPost extends Component {
	onComment() {
		this.props.dispatch( {
			type:    'SHOW_REPLY_TO_POST',
			payload: { postId: this.props.post.id },
		} );
	}
	render() {
		if ( ! this.props.writeComments ) {
			debugger
		}
		const post = this.props.post;
		const author = this.props.author.data;
		let comments = this.props.comments.data ? this.props.comments.data.filter( comment => comment.parent === 0 ) : [];
		const categories = this.props.categories.data ? this.props.categories.data : [];
		const commentsList = (
			<CommentsList
				allComments={this.props.comments.data ? this.props.comments.data : []}
				comments={comments}
				onComment={() => this.onComment()}
				post={this.props.post}
				showWriteComment={
					this.props.writeComments.posts[this.props.post.id] && this.props.writeComments.posts[this.props.post.id].isShowing
				}
				writingComment={this.props.writeComments.posts[this.props.post.id] && this.props.writeComments.posts[this.props.post.id].comment}
			/>
		);
		return <Post author={author}  categories={categories} post={post} onComment={() => this.onComment()}>{commentsList}</Post>
	}
}

ConnectedPost.propTypes = {
	dispatch:      Dispatch.isRequired,
	categories:    CategoriesState.isRequired,
	post:          PostShape.isRequired,
	writeComments: WriteCommentsState.isRequired,
};

const mapPropsToData = props => ( {
	comments:   `/wp/v2/comments?post=${ props.post.id }&per_page=100`,
	author:     `/wp/v2/users/${ props.post.author }`,
	categories: `/wp/v2/categories?include=${ props.post.categories.join( ',' ) }`,
} );

export default withApiData( mapPropsToData )( connect( s => s )( ConnectedPost ) );
