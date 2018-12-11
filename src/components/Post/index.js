import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';
import { Slot } from 'react-slot-fill';

import { withApiData } from '../../with-api-data';
import {
	Post as PostShape,
} from '../../shapes';

import Summary from './Summary';
import Avatar from '../Avatar';
import Button from '../Button';
import Editor from '../Editor';
import CommentsList from '../../components/CommentsList';
import Notification from '../Notification';
import Link from '../RelativeLink';
import AuthorLink from '../Message/AuthorLink';
import MessageContent from '../Message/Content';
import WriteComment from '../Message/WriteComment';
import { decodeEntities } from '../../util';
import { parseResponse } from '../../wordpress-rest-api-cookie-auth';

import './index.css';

class Post extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			expanded: false,
			isShowingReply: false,
			isEditing: false,
			isSubmitting: false,
		};
	}
	onClickReply() {
		this.setState( { isShowingReply: true } )
	}
	onClickCancelReply() {
		this.setState( { isShowingReply: false } )
	}
	onClickEdit = () => {
		this.setState( { isEditing: true } );
		this.props.onLoadEditable();
	}
	onDidCreateComment( ...args ) {
		this.setState( { isShowingReply: false } )
		this.props.refreshData();
	}
	onSubmitEditing( content, unprocessedContent ) {
		this.setState( { isSubmitting: true } );

		const body = {
			content,
			status: 'publish',
			unprocessed_content: unprocessedContent,
		};

		this.props.fetch( `/wp/v2/posts/${ this.props.data.id }`, {
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
				isSubmitting: false,
				isEditing: false,
			} );
			this.props.onInvalidate();
			this.props.invalidateDataForUrl( `/wp/v2/posts/${ this.props.data.id }?context=edit` );
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
		const post = this.props.data;
		const editable = this.props.editable ? this.props.editable.data : null;
		const author = this.props.author.data;
		const comments = this.props.comments.data ? this.props.comments.data.filter( comment => comment.parent === 0 ) : [];
		const categories = this.props.categories.data ? this.props.categories.data : [];
		// Scale title down slightly for longer titles.
		const headerStyle = {};
		if ( post.title.rendered.length > 22 ) {
			headerStyle.fontSize = '1.333333333rem';
		}

		const collapsed = ! ( this.state.expanded || this.props.expanded );

		const fillProps = {
			author,
			collapsed,
			comments,
			categories,
			post,
		};

		const classes = [
			'Post',
			collapsed && 'Post--collapsed',
		];

		const Actions = (
			<div className="actions">
				{ ! this.state.isEditing &&
					<Button onClick={ this.onClickEdit }>Edit</Button>
				}
				<Button onClick={ () => this.onClickReply() }>Reply</Button>
				<Slot name="Post.actions" fillChildProps={ fillProps } />
			</div>
		);

		return (
			<div className={ classes.filter( Boolean ).join( ' ' ) }>
				<header>
					<Avatar
						url={ author ? author.avatar_urls['96'] : '' }
						user={ author }
						size={ 60 }
					/>
					<div className="byline">
						<Link to={ post.link }>
							<h2
								style={ headerStyle }
							>
								{ decodeEntities( post.title.rendered ) }
							</h2>
						</Link>
						<span className="date">
							{ author ? (
								<AuthorLink user={ author }>{ author.name }</AuthorLink>
							) : ''},&nbsp;
							<time
								dateTime={ post.date_gmt + 'Z' }
								title={ post.date_gmt + 'Z' }
							>
								<FormattedRelative value={ post.date_gmt + 'Z' } />
							</time>
						</span>
						{categories.length > 0 &&
							<ul className="categories">
								{ categories.map( category => (
									<li key={ category.id }>
										<Link to={ category.link }>{ category.name }</Link>
									</li>
								) ) }
							</ul>
						}
						{ post.status === 'draft' && (
							<span className="Post__status">
								<span role="img" aria-label="">🔒</span>
								Unpublished
							</span>
						) }
						<Slot name="Post.byline" fillChildProps={ fillProps } />
					</div>
					{ Actions }
				</header>
				<div className="Post-content-wrap">
					<Slot name="Post.before_content" fillChildProps={ fillProps } />
					{ this.state.isEditing ? (
						editable ? (
							<Editor
								initialValue={ editable.unprocessed_content || editable.content.raw }
								submitText={ this.state.isSubmitting ? 'Updating…' : 'Update' }
								onCancel={ () => this.setState( { isEditing: false } ) }
								onSubmit={ ( ...args ) => this.onSubmitEditing( ...args ) }
								onUpload={ this.onUpload }
							/>
						) : (
							<Notification>Loading…</Notification>
						)
					) : (
						<MessageContent html={ post.content.rendered } />
					) }
					<Slot name="Post.after_content" fillChildProps={ fillProps } />
					<div className="Post-footer-actions">
						{ Actions }
						<Slot name="Post.footer_actions" fillChildProps={ fillProps } />
					</div>
				</div>
				{ collapsed ? (
					<Summary
						comments={ this.props.comments.data || [] }
						post={ post }
						onExpand={ () => this.setState( { expanded: true } ) }
					/>
				) : (
					<CommentsList
						allComments={ this.props.comments.data ? this.props.comments.data : [] }
						comments={ comments }
						post={ post }
						onComment={ () => this.onComment() }
						onDidCreateComment={ ( ...args ) => this.onDidCreateComment( ...args ) }
					>
						{ this.state.isShowingReply && (
							<WriteComment
								parentPost={ post }
								onCancel={ () => this.onClickCancelReply() }
								onDidCreateComment={ ( ...args ) => this.onDidCreateComment( ...args ) }
							/>
						) }
					</CommentsList>
				) }
			</div>
		);
	}
}

Post.propTypes = {
	collapsed: PropTypes.bool.isRequired,
	data: PostShape.isRequired,
};

const mapPropsToData = props => {
	const urls = {
		comments: `/wp/v2/comments?post=${ props.data.id }&per_page=100`,
		author: `/wp/v2/users/${ props.data.author }`,
		categories: `/wp/v2/categories?include=${ props.data.categories.join( ',' ) }`,
	};

	if ( props.needsEditable ) {
		urls.editable = `/wp/v2/posts/${ props.data.id }?context=edit`;
	}

	return urls;
};

const PostWithData = withApiData( mapPropsToData )( Post );

class EditablePost extends React.Component {
	state = {
		needsEditable: false,
	};

	render() {
		return (
			<PostWithData
				{ ...this.props }
				needsEditable={ this.state.needsEditable }
				onLoadEditable={ () => this.setState( { needsEditable: true } ) }
			/>
		);
	}
}

export default EditablePost;
