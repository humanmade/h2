import { withSingle } from '@humanmade/repress';
import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';
import { Slot } from 'react-slot-fill';
import PropTypes from 'prop-types';

import Avatar from './Avatar';
import Button from './Button';
import CommentsList from './CommentsList';
import Editor from './Editor';
import AuthorLink from './Message/AuthorLink';
import MessageContent from './Message/Content';
import WriteComment from './Message/WriteComment';
import Notification from './Notification';
import { Comment as CommentShape } from '../shapes';
import { comments, users } from '../types';
import { parseResponse } from '../wordpress-rest-api-cookie-auth';

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
		this.setState( { isShowingReply: false } )
		this.props.onDidCreateComment( ...args );
	}

	onSubmitEditing( content, unprocessedContent ) {
		this.setState( { isSubmitting: true } );

		const body = {
			content,
			unprocessed_content: unprocessedContent,
		};

		this.props.fetch( `/wp/v2/comments/${ this.props.comment.id }`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( body ),
			method: 'POST',
		} ).then( r => r.json().then( data => {
			if ( ! r.ok ) {
				this.setState( {
					isSubmitting: false,
					error: data,
				} );
				return;
			}

			this.setState( {
				isEditing: false,
				isSubmitting: false,
			} );
			this.props.invalidateDataForUrl( `/wp/v2/comments?post=${ this.props.parentPost.id }&per_page=100` );
			this.props.invalidateDataForUrl( `/wp/v2/comments/${ this.props.comment.id }?context=edit` );
		} ) );
	}

	onUpload = file => {
		const options = { method: 'POST' };
		options.body = new FormData();
		options.body.append( 'file', file );

		return this.props.fetch( '/wp/v2/media', options )
			.then( parseResponse );
	}

	render() {
		const { author, comment, loading } = this.props;
		const post = this.props.parentPost;
		const directComments = this.props.comments.filter( c => c.parent === comment.id );

		const fillProps = {
			author,
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
				<header>
					<Avatar
						url={ author ? author.avatar_urls['96'] : '' }
						user={ author }
						size={ 40 }
					/>
					<strong>
						{ author ? (
							<AuthorLink user={ author }>{ author.name }</AuthorLink>
						) : comment.author_name }
					</strong>
					<div className="actions">
						<a
							className="Comment-date"
							href={ `${ post.link }#comment-${ comment.id }` }
						>
							<time
								dateTime={ comment.date_gmt + 'Z' }
								title={ comment.date_gmt + 'Z' }
							>
								<FormattedRelative value={ comment.date_gmt + 'Z' } />
							</time>
						</a>
						{ ! this.state.isEditing && (
							<Button onClick={ this.onClickEdit }>Edit</Button>
						) }
						<Button onClick={ () => this.setState( { isShowingReply: true } ) }>Reply</Button>
						<Slot name="Comment.actions" fillChildProps={ fillProps } />
					</div>
				</header>
				<div className="body">
					<Slot name="Comment.before_content" fillChildProps={ fillProps } />
					{ this.state.isEditing ? (
						loading ? (
							<Notification>Loading…</Notification>
						) : (
							<Editor
								initialValue={ comment.meta.unprocessed_content || comment.content.raw }
								submitText={ this.state.isSubmitting ? 'Updating…' : 'Update' }
								onCancel={ () => this.setState( { isEditing: false } ) }
								onSubmit={ ( ...args ) => this.onSubmitEditing( ...args ) }
								onUpload={ this.onUpload }
							/>
						)
					) : (
						<MessageContent html={ comment.content.rendered } />
					) }
					<Slot name="Comment.after_content" fillChildProps={ fillProps } />
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

export default withSingle(
	users,
	state => state.users,
	props => props.comment.author,
	{
		mapDataToProps: data => ( {
			author: data.post,
			loadingAuthor: data.loading,
		} ),
		mapActionsToProps: () => ( {} ),
	}
)( withSingle(
	comments,
	state => state.comments,
	props => props.comment.id,
	{
		mapDataToProps: data => ( {
			comment: data.post,
			loading: data.loading,
		} ),
	}
)( Comment ) );
