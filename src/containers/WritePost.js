import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { uploadMedia } from '../actions';
import WritePost from '../components/WritePost';
import { UsersState, Dispatch, WritePostState } from '../shapes';
import store from '../store';

const DRAFT_KEY = 'h2-draft-post';

class ConnectedWritePost extends Component {
	componentWillMount() {
		const autosave = window.localStorage.getItem( DRAFT_KEY ) || '';
		this.setState( { autosave } );
	}

	onCancel() {
		this.props.dispatch( { type: 'WRITE_POST_CANCELLED' } );
		window.localStorage.removeItem( DRAFT_KEY );
	}

	onAutosave( content ) {
		// Save to localStorage asynchronously.
		window.setTimeout( () => {
			window.localStorage.setItem( DRAFT_KEY, content );
		} );
	}

	onSave( content ) {
		const newPost = {
			content,
			status: 'publish',
		};
		this.props.dispatch( store.actions.posts.create( newPost ) );
		window.localStorage.removeItem( DRAFT_KEY );
	}

	onUpload( file ) {
		return this.props.dispatch( uploadMedia( file ) );
	}

	render() {
		const post = this.props.writePost.post;
		const author = Object.values( this.props.user.byId )[0];
		return <WritePost
			author={author}
			autosave={ this.state.autosave }
			post={post}
			onAutosave={ content => this.onAutosave( content ) }
			onCancel={() => this.onCancel()}
			onChange={post => this.onChange( post )}
			onSave={content => this.onSave( content )}
			onUpload={ file => this.onUpload( file ) }
		/>;
	}
}

ConnectedWritePost.propTypes = {
	children:  PropTypes.any,
	dispatch:  Dispatch.isRequired,
	user:      UsersState.isRequired,
	writePost: WritePostState.isRequired,
};

export default connect( s => s )( ConnectedWritePost );
