import PropTypes from 'prop-types';
import { withSingle } from '@humanmade/repress';
import React, { Component } from 'react';
import { Slot } from 'react-slot-fill';

import { withCategories, withUser } from '../../hocs';
import {
	Post as PostShape,
} from '../../shapes';
import { posts } from '../../types';

import Summary from './Summary';
import PostComments from './Comments';
import Button from '../Button';
import MessageHeader from '../Message/Header';
import MessageMain from '../Message/Main';

import './index.css';

export class Post extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			expanded: false,
			isShowingReply: false,
			isEditing: false,
			isSubmitting: false,
		};
	}

	onClickReply = () => {
		this.setState( { isShowingReply: true } )
	}

	onClickCancelReply = () => {
		this.setState( { isShowingReply: false } )
	}

	onClickEdit = () => {
		this.setState( { isEditing: true } );
		if ( ! ( 'raw' in this.props.post.content ) ) {
			this.props.onLoad( 'edit' );
		}
	}

	onDidCreateComment = ( ...args ) => {
		this.setState( { isShowingReply: false } )
	}

	onSubmitEditing = ( content, unprocessedContent ) => {
		this.setState( { isSubmitting: true } );

		const body = {
			content,
			status: 'publish',
			unprocessed_content: unprocessedContent,
		};

		this.props.onUpdatePost( body )
			.then( () => {
				this.setState( {
					isSubmitting: false,
					isEditing: false,
				} );
			} )
			.catch( error => {
				this.setState( {
					isSubmitting: false,
					error,
				} );
			} )
	}

	render() {
		const { post, user } = this.props;
		const categories = this.props.categories.data ? this.props.categories.data.filter( category => post.categories.indexOf( category.id ) >= 0 ) : [];

		const collapsed = ! ( this.state.expanded || this.props.expanded );

		const fillProps = {
			author: user,
			collapsed,
			// comments,
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
				<Button onClick={ this.onClickReply }>Reply</Button>
				<Slot name="Post.actions" fillChildProps={ fillProps } />
			</div>
		);

		return (
			<div className={ classes.filter( Boolean ).join( ' ' ) }>
				<MessageHeader
					author={ user }
					categories={ categories }
					collapsed={ collapsed }
					post={ post }
				>
					{ Actions }
				</MessageHeader>

				<MessageMain
					author={ user }
					categories={ categories }
					collapsed={ collapsed }
					post={ post }
					isEditing={ this.state.isEditing }
					isLoading={ this.props.loading }
					isSubmitting={ this.state.isSubmitting }
					onCancel={ () => this.setState( { isEditing: false } ) }
					onSubmitEditing={ this.onSubmitEditing }
				>
					{ Actions }
				</MessageMain>

				{ collapsed ? (
					<Summary
						post={ post }
						onExpand={ () => this.setState( { expanded: true } ) }
					/>
				) : (
					<PostComments
						post={ post }
						showingReply={ this.state.isShowingReply }
						onCancelReply={ this.onClickCancelReply }
						onDidCreateComment={ this.onDidCreateComment }
					/>
				) }
			</div>
		);
	}
}

Post.propTypes = {
	data: PostShape.isRequired,
	expanded: PropTypes.bool.isRequired,
};

Post.defaultProps = {
	expanded: true,
};

export default withCategories(
	withSingle(
		posts,
		state => state.posts,
		props => props.data.id
	)(
		withUser( props => props.post.author )( Post )
	)
);
