import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Slot } from 'react-slot-fill';

import { withUser } from '../../hocs';
import {
	Post as PostShape,
} from '../../shapes';
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
			'Page',
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
			</div>
		);
	}
}

Page.propTypes = {
	collapsed: PropTypes.bool.isRequired,
	data: PostShape.isRequired,
};

export default withUser( props => props.post.author )( Page );
