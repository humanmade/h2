import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import Avatar from './Avatar';
import Editor from './Editor';
import { User, Post, Comment } from '../shapes';

import './WriteComment.css';

export default class WriteComment extends React.Component {
	componentDidMount() {
		if ( this.container && this.editor ) {
			this.editor.focus();
			const node = ReactDOM.findDOMNode( this.container );
			if ( node && node.scrollIntoView ) {
				node.scrollIntoView( false );
			}
		}
	}

	render() {
		return <div className="WriteComment" ref={ ref => this.container = ref }>
			<header>
				<Avatar
					url={this.props.author ? this.props.author.avatar_urls['96'] : ''}
					size={50}
				/>
				<strong>{this.props.author ? this.props.author.name : ''}</strong>
			</header>
			<div className="body">
				<Editor
					onCancel={this.props.onCancel}
					onSubmit={this.props.onSave}
				/>
			</div>
		</div>;
	}
}

WriteComment.propTypes = {
	author: User,
	comment: Comment.isRequired,
	post: Post.isRequired,
	onCancel: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
};
