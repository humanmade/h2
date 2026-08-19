import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Comment as CommentShape, Post } from '../shapes';

import Comment from './Comment';
import SlackMention from './Comment/SlackMention';

import './CommentsList.css';

export default class CommentsList extends Component {
	render() {
		return (
			<div className="CommentsList flex-col">
				{ this.props.comments.slice().sort( ( a, b ) => a.date < b.date ? -1 : 1 ).map( comment => (
					// "Shared in Slack" markers render as a quiet leaf row and
					// must skip Comment's withUser/withSingle HOCs (they need
					// neither an author fetch nor a single-comment load).
					comment.type === 'slack_mention' ? (
						<SlackMention
							key={ comment.id }
							comment={ comment }
						/>
					) : (
						<Comment
							key={ comment.id }
							comment={ comment }
							comments={ this.props.allComments }
							parentPost={ this.props.post }
							onDidCreateComment={ this.props.onDidCreateComment }
						/>
					)
				) ) }
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
