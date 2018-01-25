import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthorName from './AuthorName';
import Avatar from './Avatar';
import Button from './Button';
import CommentsList from './CommentsList';
import PostContent from './PostContent';
import WriteComment from './WriteComment';
import { Comment as CommentShape } from '../shapes';
import { withApiData } from '../with-api-data';
import './Comment.css';

export class Comment extends Component {
	constructor( props ) {
		super( props );
		this.state = { isShowingReply: false };
	}
	onClickReply() {
		this.setState( { isShowingReply: true } )
	}
	onClickCancelReply() {
		this.setState( { isShowingReply: false } )
	}
	onWroteComment(...args) {
		this.setState( { isShowingReply: false })
		this.props.onWroteComment(...args);
	}
	render() {
		const comment = this.props.comment;
		const post = this.props.post;
		const author = this.props.author.data;
		const directComments = this.props.comments.filter( c => c.parent === comment.id );

		return <div className="Comment">
			<header>
				<Avatar
					url={author ? author.avatar_urls['96'] : ''}
					size={40}
				/>
				<strong>
					{ author ? <AuthorName user={ author } /> : '' }
				</strong>
				<div className="actions">
					<Button onClick={() => this.onClickReply()}>Reply</Button>
				</div>
			</header>
			<div className="body">
				<PostContent html={this.props.comment.content.rendered} />
			</div>
			<CommentsList
				allComments={this.props.comments}
				comments={directComments}
				post={post}
				showWriteComment={false}
				onWroteComment={this.props.onWroteComment}
			>
				{this.state.isShowingReply &&
					<WriteComment
						comment={comment}
						post={post}
						onCancel={() => this.onClickCancelReply()}
						onWroteComment={(...args) => this.onWroteComment(...args)}
					/>
				}
			</CommentsList>
		</div>;
	}
}

Comment.propTypes = {
	comment: CommentShape.isRequired,
	onWroteComment: PropTypes.func.isRequired,
};

export default withApiData( props => ( { author: `/wp/v2/users/${ props.comment.author }` } ) )( Comment );
