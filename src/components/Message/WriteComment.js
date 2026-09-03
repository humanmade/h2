import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { withCurrentUser } from '../../hocs';
import { Post } from '../../shapes';
import { comments } from '../../types';
import Avatar from '../Avatar';
import Editor from '../Editor/LazyEditor';
import Notification from '../Notification';
import RemotePreview from '../RemotePreview';

export class WriteComment extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			isSubmitting: false,
			error: null,
		};
	}

	componentDidMount() {
		if ( this.container && this.editor ) {
			this.editor.focus();
			const node = ReactDOM.findDOMNode( this.container );
			if ( node && node.scrollIntoView ) {
				node.scrollIntoView( false );
			}
		}
	}

	onSubmit( content, unprocessedContent ) {
		const body = {
			content,
			post: this.props.parentPost.id,
			unprocessed_content: unprocessedContent,
		};

		if ( this.props.comment ) {
			body.parent = this.props.comment.id;
		}

		this.setState( { isSubmitting: true } );

		this.props.onCreate( body )
			.then( data => {
				this.setState( { isSubmitting: false } );

				this.props.onDidCreateComment();
			} )
			.catch( error => {
				this.setState( {
					isSubmitting: false,
					error,
				} );
			} );
	}

	render() {
		return (
			<div
				className="WriteComment [&_.buttons]:mb-[10px] [&_.Editor-editor]:min-h-48"
				ref={ ref => this.container = ref }
			>
				<header className="h-[50px] leading-[50px] flex mb-[10px] -ml-[60px] max-[600px]:ml-0 max-[600px]:static max-[600px]:h-auto max-[600px]:flex-wrap">
					<Avatar
						className="mr-5 max-[600px]:w-6! max-[600px]:h-6! max-[600px]:-ml-[30px] max-[600px]:mr-[6px] max-[600px]:py-2 max-[600px]:px-0 max-[600px]:bg-white max-[600px]:after:top-2"
						imgClassName="max-[600px]:w-6! max-[600px]:h-6!"
						url={ this.props.currentUser ? this.props.currentUser.avatar_urls['96'] : '' }
						user={ this.props.currentUser }
						size={ 40 }
					/>
					<strong>{ this.props.currentUser ? this.props.currentUser.name : '' }</strong>
				</header>
				<div className="[&>.Notification]:-mt-[1.36667rem] max-[600px]:-ml-5">
					<Editor
						allowBlocks
						previewComponent={ props => <RemotePreview type="comment" { ...props } /> }
						ref={ editor => this.editor = editor }
						submitText={ this.state.isSubmitting ? 'Commenting...' : 'Comment' }
						onCancel={ this.props.onCancel }
						onSubmit={ ( ...args ) => this.onSubmit( ...args ) }
					/>

					{ this.state.error && (
						<Notification type="error">
							Could not submit: { this.state.error.message }
						</Notification>
					) }
				</div>
			</div>
		);
	}
}

WriteComment.propTypes = {
	parentPost: Post.isRequired,
	onCancel: PropTypes.func.isRequired,
	onDidCreateComment: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => {
	return {
		onCreate: data => dispatch( comments.createSingle( data ) ),
	};
};

export default connect( () => ( {} ), mapDispatchToProps )( withCurrentUser( WriteComment ) );
