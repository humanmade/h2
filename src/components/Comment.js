import { withSingle } from '@humanmade/repress';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Slot } from 'react-slot-fill';

import { withUser } from '../hocs';
import { Comment as CommentShape } from '../shapes';
import { comments } from '../types';

import Actions from './Comment/Actions';
import CommentHeader from './Comment/Header';
import CommentsList from './CommentsList';
import Editor from './Editor/LazyEditor';
import MessageContent from './Message/Content';
import WriteComment from './Message/WriteComment';
import Notification from './Notification';

import './Comment.css';

export class Comment extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			isShowingReply: false,
			isEditing: false,
			isSubmitting: false,
		};
		this.element = null;
	}

	componentDidMount() {
		const { comment } = this.props;

		if ( window.location.hash === `#comment-${ comment.id }` && this.element ) {
			this.element.scrollIntoView();
		}
	}

	onClickEdit = () => {
		this.setState( { isEditing: true } );
		if ( ! ( 'raw' in this.props.comment.content ) ) {
			this.props.onLoad( 'edit' );
		}
	}

	onDidCreateComment( ...args ) {
		this.setState( { isShowingReply: false } );
		this.props.onDidCreateComment( ...args );
	}

	onSubmitEditing( content, unprocessedContent ) {
		this.setState( { isSubmitting: true } );

		const body = {
			content,
			unprocessed_content: unprocessedContent,
		};

		this.props.onUpdate( body )
			.then( data => {
				this.setState( {
					isEditing: false,
					isSubmitting: false,
				} );
			} )
			.catch( error => {
				this.setState( {
					isSubmitting: false,
					error,
				} );
			} );
	}

	render() {
		const { comment, loading, user } = this.props;
		const post = this.props.parentPost;
		const directComments = this.props.comments.filter( c => c.parent === comment.id );

		const fillProps = {
			author: user,
			comment,
			comments: this.props.comments,
			post,
		};

		return (
			<div
				className="Comment"
				id={ `comment-${ comment.id }` }
				ref={ el => this.element = el }
			>
				<CommentHeader
					author={ user }
					comment={ comment }
				>
					<Actions
						canEdit={ comment.user_can.edit }
						fillProps={ fillProps }
						isEditing={ this.state.isEditing }
						onEdit={ this.onClickEdit }
						onReply={ () => this.setState( { isShowingReply: true } ) }
					/>
				</CommentHeader>

				<div className="body">
					<Slot name="Comment.before_content" fillChildProps={ fillProps } />
					{ this.state.isEditing ? (
						loading ? (
							<Notification>Loading…</Notification>
						) : (
							<Editor
								initialValue={ comment.unprocessed_content || comment.content.raw }
								submitText={ this.state.isSubmitting ? 'Updating…' : 'Update' }
								onCancel={ () => this.setState( { isEditing: false } ) }
								onSubmit={ ( ...args ) => this.onSubmitEditing( ...args ) }
							/>
						)
					) : (
						<MessageContent html={ comment.content.rendered } />
					) }
					<Slot name="Comment.after_content" fillChildProps={ fillProps } />
					<div className="Comment-footer-actions">
						<Actions
							fillProps={ fillProps }
							isEditing={ this.state.isEditing }
							onEdit={ this.onClickEdit }
							onReply={ () => this.setState( { isShowingReply: true } ) }
						/>

						<Slot name="Comment.footer_actions" fillChildProps={ fillProps } />
					</div>
				</div>
				<CommentsList
					allComments={ this.props.comments }
					comments={ directComments }
					post={ post }
					showWriteComment={ false }
					onDidCreateComment={ this.props.onDidCreateComment }
				>
					{ this.state.isShowingReply && (
						<WriteComment
							comment={ comment }
							parentPost={ post }
							onCancel={ () => this.setState( { isShowingReply: false } ) }
							onDidCreateComment={ ( ...args ) => this.onDidCreateComment( ...args ) }
						/>
					) }
				</CommentsList>
			</div>
		);
	}
}

Comment.propTypes = {
	comment: CommentShape.isRequired,
	onDidCreateComment: PropTypes.func.isRequired,
};

export default withUser( props => props.comment.author )( withSingle(
	comments,
	state => state.comments,
	props => props.comment.id,
	{
		mapDataToProps: data => ( {
			comment: data.post,
			loading: data.loading,
		} ),
		mapActionsToProps: actions => ( {
			onLoad: actions.onLoad,
			onUpdate: actions.onUpdatePost,
		} ),
	}
)( Comment ) );
