import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Comment as CommentShape, Post } from '../shapes';

import Comment from './Comment';
import HumanMention from './Comment/HumanMention';
import SlackMention from './Comment/SlackMention';

import './CommentsList.css';

export default class CommentsList extends Component {
	renderComment = comment => {
		if ( comment.type === 'slack_mention' ) {
			return <SlackMention key={ comment.id } comment={ comment } />;
		}
		if ( comment.type === 'human_mention' ) {
			return <HumanMention key={ comment.id } comment={ comment } />;
		}
		return (
			<Comment
				key={ comment.id }
				comment={ comment }
				comments={ this.props.allComments }
				parentPost={ this.props.post }
				onDidCreateComment={ this.props.onDidCreateComment }
			/>
		);
	}

	render() {
		return (
			<div className="CommentsList flex-col">
				{ this.props.comments
					.slice()
					.sort( ( a, b ) => a.date < b.date ? -1 : 1 )
					.map( this.renderComment ) }
				{ this.props.children }
			</div>
		);
	}
}

CommentsList.propTypes = {
	allComments: PropTypes.arrayOf( CommentShape ).isRequired,
	comments: PropTypes.arrayOf( CommentShape ).isRequired,
	post: Post.isRequired,
	onDidCreateComment: PropTypes.func.isRequired,
};
