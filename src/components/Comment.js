import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';
import { Slot } from 'react-slot-fill';
import PropTypes from 'prop-types';

import Avatar from './Avatar';
import Button from './Button';
import CommentsList from './CommentsList';
import AuthorName from './Message/AuthorName';
import MessageContent from './Message/Content';
import Reactions from './Message/Reactions';
import WriteComment from './Message/WriteComment';
import { Comment as CommentShape } from '../shapes';
import { withApiData } from '../with-api-data';

import './Comment.css';

export class Comment extends Component {
	constructor( props ) {
		super( props );
		this.state = { isShowingReply: false };
	}
	onDidCreateComment( ...args ) {
		this.setState( { isShowingReply: false } )
		this.props.onDidCreateComment( ...args );
	}
	render() {
		const comment = this.props.comment;
		const post = this.props.parentPost;
		const author = this.props.author.data;
		const directComments = this.props.comments.filter( c => c.parent === comment.id );

		const fillProps = { author, comment, comments: this.props.comments, post };

		return <div
			className="Comment"
			id={ `comment-${ comment.id }` }
		>
			<header>
				<Avatar
					url={author ? author.avatar_urls['96'] : ''}
					user={ author }
					size={40}
				/>
				<strong>
					{ author ?
						<AuthorName user={ author } />
					:
						comment.author_name
					}
				</strong>
				<div className="actions">
					<a
						className="Comment-date"
						href={ `${ post.link }#comment-${ comment.id }` }
					>
						<time
							datetime={ comment.date_gmt + 'Z' }
							title={ comment.date_gmt + 'Z' }
						>
							<FormattedRelative value={ comment.date_gmt + 'Z' } />
						</time>
					</a>
					<Button onClick={() => this.setState( { isShowingReply: true } )}>Reply</Button>
					<Slot name="Comment.actions" fillChildProps={ fillProps } />
				</div>
			</header>
			<div className="body">
				<Slot name="Comment.before_content" fillChildProps={ fillProps } />
				<MessageContent html={this.props.comment.content.rendered} />
				<Slot name="Comment.after_content" fillChildProps={ fillProps } />
				<Reactions
					commentId={ this.props.comment.id }
					postId={ post.id }
				/>
			</div>
			<CommentsList
				allComments={this.props.comments}
				comments={directComments}
				post={post}
				showWriteComment={false}
				onDidCreateComment={this.props.onDidCreateComment}
			>
				{this.state.isShowingReply &&
					<WriteComment
						comment={comment}
						parentPost={post}
						onCancel={() => this.setState( { isShowingReply: false } )}
						onDidCreateComment={( ...args ) => this.onDidCreateComment( ...args )}
					/>
				}
			</CommentsList>
		</div>;
	}
}

Comment.propTypes = {
	comment:        CommentShape.isRequired,
	onDidCreateComment: PropTypes.func.isRequired,
};

export default withApiData( props => ( { author: `/wp/v2/users/${ props.comment.author }` } ) )( Comment );
