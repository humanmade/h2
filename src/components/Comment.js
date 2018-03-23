import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';
import PropTypes from 'prop-types';

import Avatar from './Avatar';
import Button from './Button';
import CommentsList from './CommentsList';
import AuthorLink from './Message/AuthorLink';
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
						<AuthorLink user={ author }>{ author.name }</AuthorLink>
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
				</div>
			</header>
			<div className="body">
				<MessageContent html={this.props.comment.content.rendered} />
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
