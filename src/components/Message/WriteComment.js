import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Avatar from '../Avatar';
import Editor from '../Editor';
import Notification from '../Notification';
import RemotePreview from '../RemotePreview';
import { withCurrentUser } from '../../hocs';
import { Post } from '../../shapes';
import { comments } from '../../types';

import './WriteComment.css';

class WriteComment extends React.Component {
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
			meta: { unprocessed_content: unprocessedContent },
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
			<div className="WriteComment" ref={ ref => this.container = ref }>
				<header>
					<Avatar
						url={ this.props.currentUser ? this.props.currentUser.avatar_urls['96'] : '' }
						user={ this.props.currentUser }
						size={ 40 }
					/>
					<strong>{ this.props.currentUser ? this.props.currentUser.name : '' }</strong>
				</header>
				<div className="body">
					<Editor
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
