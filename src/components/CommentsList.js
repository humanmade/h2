import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Button from './Button';
import CommentComponent from '../containers/Comment';
import WriteComment from '../containers/WriteComment';
import { Comment, Post } from '../shapes';

import './CommentsList.css';

export default class CommentsList extends Component {

	displayedComments = [];

    /**
	 * Recursively render threaded comments
	 *
     * @param comments
     */
	renderThreadedComments = ( comments ) => {
        return comments.map( ( comment ) => {
        	if ( this.displayedComments.indexOf( comment.id ) !== -1 ) {
        		return;
			}

        	const childrenIds = comment.children;
        	const hasChildren = childrenIds.length;

        	// Get the real children objects
			const children = childrenIds.map( ( childCommentId ) => {
				return this.props.comments[ childCommentId ];
			});

        	const c = <div className="CommentThread">
				<CommentComponent key={comment.id} comment={comment}/>
                {hasChildren ? this.renderThreadedComments( children ) : null}
			</div>;

            this.displayedComments.push( comment.id );

            return c;
        });
	};
	render() {
        return <div className="CommentsList">
			{ this.renderThreadedComments( this.props.comments ) }
            {this.props.showWriteComment
                ? <WriteComment post={this.props.post} comment={this.props.writingComment} />
                : <div className="post-reply">
					<Button onClick={this.props.onComment}>Reply</Button>
				</div>}

		</div>;
	}
}

CommentsList.propTypes = {
	comments: PropTypes.arrayOf( Comment ).isRequired,
	post: Post.isRequired,
	showWriteComment: PropTypes.bool.isRequired,
	writingComment: Comment.isRequired,
	onComment: PropTypes.func.isRequired,
};
