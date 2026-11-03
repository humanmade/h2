import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Slot } from 'react-slot-fill';

import {
	Post as PostShape,
} from '../../shapes';
import { decodeEntities } from '../../util';
import Button from '../Button';
import MessageHeader from '../Message/Header';
import MessageMain from '../Message/Main';

class Page extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			expanded: false,
			isShowingReply: false,
			isEditing: false,
			isSubmitting: false,
		};
	}

	onClickEdit = () => {
		this.setState( {
			isEditing: true,
			editingTitle: this.props.post.title.raw !== undefined ? this.props.post.title.raw : decodeEntities( this.props.post.title.rendered ),
		} );
		if ( ! ( 'raw' in this.props.post.content ) ) {
			this.props.onLoad( 'edit' );
		}
	}

	onDidCreateComment = ( ...args ) => {
		this.setState( { isShowingReply: false } );
	}

	onSubmitEditing = ( content, unprocessedContent, title ) => {
		this.setState( { isSubmitting: true } );

		const body = {
			content,
			title,
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
		const { post, user } = this.props;
		const categories = [];

		const collapsed = false;
		const fillProps = {
			author: user,
			collapsed,
			categories,
			post,
		};

		const classes = [
			'Page relative py-6 m-0',
			collapsed && 'Page--collapsed',
		];

		const Actions = (
			<div className="actions">
				{ ! this.state.isEditing && (
					<Button onClick={ this.onClickEdit }>Edit</Button>
				) }
				<Slot name="Page.actions" fillChildProps={ fillProps } />
			</div>
		);

		return (
			<div className={ classes.filter( Boolean ).join( ' ' ) }>
				<MessageHeader
					editableTitle={ this.state.isEditing ? this.state.editingTitle : undefined }
					isSubmitting={ this.state.isSubmitting }
					onTitleChange={ editingTitle => this.setState( { editingTitle } ) }
					sticky={ ! this.state.isEditing }
					author={ user }
					categories={ categories }
					collapsed={ collapsed }
					post={ post }
				>
					{ Actions }
				</MessageHeader>

				<MessageMain
					editedTitle={ this.state.editingTitle }
					author={ user }
					categories={ categories }
					collapsed={ collapsed }
					post={ post }
					isEditing={ this.state.isEditing }
					isLoading={ this.props.loading }
					isSubmitting={ this.state.isSubmitting }
					onCancelEdit={ () => this.setState( { isEditing: false } ) }
					onSubmitEditing={ this.onSubmitEditing }
				>
					{ Actions }
				</MessageMain>
			</div>
		);
	}
}

Page.propTypes = {
	collapsed: PropTypes.bool.isRequired,
	data: PostShape.isRequired,
};

export default Page;
