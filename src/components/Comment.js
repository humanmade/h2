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
import { withApiData } from '../with-api-data';
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
		this.props.onLoadEditable();
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
		const comment = this.props.comment;
		const editable = this.props.editable ? this.props.editable.data : null;
		const post = this.props.parentPost;
		const author = this.props.author.data;
		const directComments = this.props.comments.filter( c => c.parent === comment.id );

		const fillProps = {
			author,
			comment,
			comments: this.props.comments,
			post,
		};

		const Actions = (
			<div className="actions">
				{ ! this.state.isEditing && (
					<Button onClick={ this.onClickEdit }>Edit</Button>
				) }
				<Button onClick={ () => this.setState( { isShowingReply: true } ) }>Reply</Button>
				<Slot name="Comment.actions" fillChildProps={ fillProps } />
			</div>
		);

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
					<div className="actions-wrap">
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
						{ Actions }
					</div>
				</header>
				<div className="body">
					<Slot name="Comment.before_content" fillChildProps={ fillProps } />
					{ this.state.isEditing ? (
						editable ? (
							<Editor
								initialValue={ editable.meta.unprocessed_content || editable.content.raw }
								submitText={ this.state.isSubmitting ? 'Updating…' : 'Update' }
								onCancel={ () => this.setState( { isEditing: false } ) }
								onSubmit={ ( ...args ) => this.onSubmitEditing( ...args ) }
								onUpload={ this.onUpload }
							/>
						) : (
							<Notification>Loading…</Notification>
						)
					) : (
						<MessageContent html={ this.props.comment.content.rendered } />
					) }
					<Slot name="Comment.after_content" fillChildProps={ fillProps } />
					<div className="Comment-footer-actions">
						{ Actions }
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

const mapPropsToData = props => {
	const urls = {
		author: `/wp/v2/users/${ props.comment.author }`,
	};

	if ( props.needsEditable ) {
		urls.editable = `/wp/v2/comments/${ props.comment.id }?context=edit`;
	}

	return urls;
}

const CommentWithData = withApiData( mapPropsToData )( Comment );

class EditablePost extends React.Component {
	state = {
		needsEditable: false,
	};

	render() {
		return (
			<CommentWithData
				{ ...this.props }
				needsEditable={ this.state.needsEditable }
				onLoadEditable={ () => this.setState( { needsEditable: true } ) }
			/>
		);
	}
}

export default EditablePost;
