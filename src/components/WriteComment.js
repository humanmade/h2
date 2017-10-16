import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import Avatar from './Avatar';
import Button from './Button';
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
			<Avatar
				url={this.props.author ? this.props.author.avatar_urls['96'] : ''}
				size={50}
			/>
			<div className="body">
				<header>
					<strong>{this.props.author ? this.props.author.name : ''}</strong>
				</header>
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
