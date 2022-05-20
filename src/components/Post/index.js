import { withSingle } from '@humanmade/repress';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Slot } from 'react-slot-fill';

import { withCategories, withUser } from '../../hocs';
import {
	Post as PostShape,
} from '../../shapes';
import { posts } from '../../types';
import Button from '../Button';
import { Dropdown, DropdownContent } from '../Dropdown';
import MessageHeader from '../Message/Header';
import MessageMain from '../Message/Main';

import PostComments from './Comments';
import Summary from './Summary';

import './index.css';

const SecondaryActions = props => {
	const { fillProps, showEdit, onClickEdit } = props;

	const renderItems = items => {
		if ( ! items.length && ! showEdit ) {
			return null;
		}

		return (
			<DropdownContent>
				{ showEdit && (
					<Button onClick={ onClickEdit }>Edit</Button>
				) }

				{ items }
			</DropdownContent>
		);
	};

	return (
		<Slot
			name="Post.actions"
			fillChildProps={ fillProps }
		>
			{ renderItems }
		</Slot>
	);
};

export class Post extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			expanded: props.viewMode === 'full',
			isShowingReply: false,
			isEditing: false,
			isSubmitting: false,
		};
	}

	componentDidMount() {
		// Manually work around issue where app ignores anchors within the post content.
		if ( ! this.props.collapsed && window.location.hash ) {
			const target = window.location.hash;
			window.location.hash = '';
			window.location.hash = target;
		}
	}

	componentDidUpdate( prevProps ) {
		// Permit a change in the user view mode to override current post-level state.
		if ( this.props.viewMode !== prevProps.viewMode ) {
			this.setState( {
				expanded: this.props.viewMode === 'full',
			} );
		}
	}

	onClickReply = () => {
		this.setState( { isShowingReply: true } );
	}

	onClickCancelReply = () => {
		this.setState( { isShowingReply: false } );
	}

	onClickEdit = () => {
		this.setState( { isEditing: true } );
		if ( ! ( 'raw' in this.props.post.content ) ) {
			this.props.onLoad( 'edit' );
		}
	}

	onDidCreateComment = ( ...args ) => {
		this.setState( { isShowingReply: false } );
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
			} );
	}

	render() {
		const { post, user, viewMode } = this.props;
		const { expanded, isShowingReply } = this.state;
		const categories = this.props.categories.data ? this.props.categories.data.filter( category => post.categories.indexOf( category.id ) >= 0 ) : [];

		const fillProps = {
			author: user,
			collapsed: ! expanded,
			// comments,
			categories,
			post,
		};

		const classes = expanded ? 'Post' : 'Post Post--collapsed';

		const Actions = (
			<Dropdown className="Post__actions">
				<Button onClick={ this.onClickReply }>Reply</Button>
				<SecondaryActions
					fillProps={ fillProps }
					showEdit={ ! this.state.isEditing }
					onClickEdit={ this.onClickEdit }
				/>
			</Dropdown>
		);

		const hideComments = ! ( viewMode === 'full' || isShowingReply || expanded );

		return (
			<div className={ classes }>

				<MessageHeader
					author={ user }
					categories={ categories }
					post={ post }
				>
					{ Actions }
				</MessageHeader>

				<MessageMain
					author={ user }
					categories={ categories }
					collapsed={ viewMode === 'compact' && ! isShowingReply && ! expanded }
					post={ post }
					isEditing={ this.state.isEditing }
					isLoading={ this.props.loading }
					isSubmitting={ this.state.isSubmitting }
					onCancel={ () => this.setState( { isEditing: false } ) }
					onSubmitEditing={ this.onSubmitEditing }
				>
					{ Actions }
				</MessageMain>

				{ hideComments ? (
					<Summary
						post={ post }
						postVisible={ viewMode !== 'compact' || isShowingReply }
						onExpand={ () => this.setState( { expanded: true } ) }
					/>
				) : (
					<PostComments
						post={ post }
						showingReply={ isShowingReply }
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
