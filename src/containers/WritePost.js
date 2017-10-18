import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import WritePost from '../components/WritePost';
import { UsersState, Dispatch, WritePostState } from '../shapes';
import store from '../store';

class ConnectedWritePost extends Component {
	onCancel() {
		this.props.dispatch( { type: 'WRITE_POST_CANCELLED' } );
	}
	onSave( content ) {
		const newPost = {
			content,
			status: 'publish',
		};
		this.props.dispatch( store.actions.posts.create( newPost ) );
	}
	render() {
		const post = this.props.writePost.post;
		const author = Object.values( this.props.user.byId )[0];
		return <WritePost
			author={author}
			post={post}
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
