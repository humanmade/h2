import PropTypes from 'prop-types';
import { withSingle } from '@humanmade/repress';
import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';
import { connect } from 'react-redux';
import { Slot } from 'react-slot-fill';

import { withCategories } from '../../hocs';
import {
	Post as PostShape,
} from '../../shapes';
import { posts, users } from '../../types';

import Summary from './Summary';
import PostComments from './Comments';
import Avatar from '../Avatar';
import Button from '../Button';
import Editor from '../Editor';
import Notification from '../Notification';
import Link from '../RelativeLink';
import AuthorLink from '../Message/AuthorLink';
import MessageContent from '../Message/Content';
import WriteComment from '../Message/WriteComment';
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
		if ( ! ( 'raw' in this.props.post.content ) ) {
			this.props.onLoad( 'edit' );
		}
	}
	onDidCreateComment( ...args ) {
		this.setState( { isShowingReply: false } )
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
		const { author, post } = this.props;
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
			// comments,
			categories,
			post,
		};

		const classes = [
			'Post',
			collapsed && 'Post--collapsed',
		];

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
								dangerouslySetInnerHTML={ { __html: post.title.rendered } }
								style={ headerStyle }
							/>
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
						<Slot name="Post.byline" fillChildProps={ fillProps } />
					</div>
					<div className="actions">
						{! this.state.isEditing &&
							<Button onClick={ this.onClickEdit }>Edit</Button>
						}
						<Button onClick={ () => this.onClickReply() }>Reply</Button>
						<Slot name="Post.actions" fillChildProps={ fillProps } />
					</div>
				</header>
				<div className="Post-content-wrap">
					<Slot name="Post.before_content" fillChildProps={ fillProps } />
					{ this.state.isEditing ? (
						this.props.loading ? (
							<Notification>Loading…</Notification>
						) : (
							<Editor
								initialValue={ post.meta.unprocessed_content || post.content.raw }
								submitText={ this.state.isSubmitting ? 'Updating…' : 'Update' }
								onCancel={ () => this.setState( { isEditing: false } ) }
								onSubmit={ ( ...args ) => this.onSubmitEditing( ...args ) }
								onUpload={ this.onUpload }
							/>
						)
					) : (
						<MessageContent html={ post.content.rendered } />
					) }
					<Slot name="Post.after_content" fillChildProps={ fillProps } />
				</div>
				{ collapsed ? (
					<Summary
						comments={ [] }
						post={ post }
						onExpand={ () => this.setState( { expanded: true } ) }
					/>
				) : (
					<PostComments
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
					</PostComments>
				) }
			</div>
		);
	}
}

Post.propTypes = {
	collapsed: PropTypes.bool.isRequired,
	data: PostShape.isRequired,
};

const mapStateToProps = ( state, props ) => {
	if ( ! props.post ) {
		return {};
	}

	return {
		author: users.getSingle( state.users, props.post.author ),
	};
};

export default withCategories(
	withSingle(
		posts,
		state => state.posts,
		props => props.data.id
	)(
		connect( mapStateToProps )( Post )
	)
);
