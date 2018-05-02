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
import { Comment as CommentShape } from '../shapes';
import { withApiData } from '../with-api-data';

import './Comment.css';

export class Comment extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			isShowingReply: false,
			isEditing:      false,
			isSubmitting:   false,
		};
		this.element = null;
	}

	componentDidMount() {
		const { comment } = this.props;

		if ( window.location.hash === `#comment-${ comment.id }` && this.element ) {
			this.element.scrollIntoView();
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
			meta: { unprocessed_content: unprocessedContent },
		};

		this.props.fetch( `/wp/v2/comments/${ this.props.comment.id }`, {
			headers: {
				Accept:         'application/json',
				'Content-Type': 'application/json',
			},
			body:   JSON.stringify( body ),
			method: 'POST',
		} ).then( r => r.json().then( data => {
			if ( ! r.ok ) {
				this.setState( { isSubmitting: false, error: data } );
				return;
			}

			this.setState( {
				isEditing:    false,
				isSubmitting: false,
			} );
			this.props.invalidateDataForUrl( `/wp/v2/comments?post=${ this.props.parentPost.id }&per_page=100` );
		} ) );
	}

	render() {
		const comment = this.props.comment;
		const post = this.props.parentPost;
		const author = this.props.author.data;
		const directComments = this.props.comments.filter( c => c.parent === comment.id );

		const fillProps = {
			author,
			comment,
			comments: this.props.comments,
			post,
		};

		return <div
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
						<Button onClick={ () => this.setState( { isEditing: true } ) }>Edit</Button>
					) }
					<Button onClick={ () => this.setState( { isShowingReply: true } ) }>Reply</Button>
					<Slot name="Comment.actions" fillChildProps={ fillProps } />
				</div>
			</header>
			<div className="body">
				<Slot name="Comment.before_content" fillChildProps={ fillProps } />
				{ this.state.isEditing ?
					<Editor
						initialValue={ comment.meta.unprocessed_content || comment.content.raw }
						submitText={ this.state.isSubmitting ? 'Updating…' : 'Update' }
						onCancel={ () => this.setState( { isEditing: false } )}
						onSubmit={ ( ...args ) => this.onSubmitEditing( ...args ) }
					/>
				:
					<MessageContent html={ this.props.comment.content.rendered } />
				}
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
		</div>;
	}
}

Comment.propTypes = {
	comment: CommentShape.isRequired,
	onDidCreateComment: PropTypes.func.isRequired,
};

export default withApiData( props => ( { author: `/wp/v2/users/${ props.comment.author }` } ) )( Comment );
