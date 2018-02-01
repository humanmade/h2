import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthorName from './AuthorName';
import Avatar from './Avatar';
import Button from './Button';
import CommentsList from './CommentsList';
import Editor from './Editor';
import PostContent from './PostContent';
import WriteComment from './WriteComment';
import { Comment as CommentShape } from '../shapes';
import { withApiData } from '../with-api-data';
import './Comment.css';

export class Comment extends Component {
	constructor( props ) {
		super( props );
		this.state = { isShowingReply: false, isEditing: false };
	}
	onDidCreateComment( ...args ) {
		this.setState( { isShowingReply: false } )
		this.props.onDidCreateComment( ...args );
	}
	onSubmitEditing( content, unprocessedContent ) {
		const body = {
			content,
			meta: { unprocessed_content: unprocessedContent },
		};

		this.props.fetch( `/wp/v2/comments/${ this.props.comment.id }`, {
			headers: {
				Accept:         'application/json',
				'Content-Type': 'application/json',
			},
			body:   JSON.stringify( body ),
			method: 'POST',
		} ).then( r => r.json() ).then( post  => {
			this.setState( { isEditing: false } )
			this.props.invalidateDataForUrl( `/wp/v2/comments?post=${ this.props.post.id}&per_page=100` );
		} );
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
					user={ author }
					size={40}
				/>
				<strong>
					{ author ? <AuthorName user={ author } /> : '' }
				</strong>
				<div className="actions">
					{! this.state.isEditing &&
						<Button onClick={() => this.setState( { isEditing: true } )}>Edit</Button>
					}
					<Button onClick={() => this.setState( { isShowingReply: true } )}>Reply</Button>
				</div>
			</header>
			<div className="body">
			{ this.state.isEditing ?
				<Editor
					initialValue={ comment.meta.unprocessed_content || comment.content.raw }
					submitText="Update"
					onCancel={ () => this.setState( { isEditing: false } )}
					onSubmit={ ( ...args ) => this.onSubmitEditing( ...args ) }
					/>
				:
				<PostContent html={this.props.comment.content.rendered} />
			}
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
						post={post}
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
