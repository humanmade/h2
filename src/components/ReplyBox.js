import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import FrontKit from 'frontkit'
import Avatar from './Avatar'
import { createComment } from '../actions'

class CommentBox extends Component {
	static propTypes = {
		post: PropTypes.object.isRequired,
		comment: PropTypes.object,
		user: PropTypes.object.isRequired,
		onPosted: PropTypes.func.isRequired,
	}
	constructor() {
		super()
		this.state = {
			text: ''
		}
	}
	onSubmit(e) {
		e.preventDefault()
		this.props.dispatch( createComment({
			content: this.state.text,
			post: this.props.post.id,
			parent: this.props.comment ? this.props.comment.id : 0,
		})).then( data  => {
			this.props.onPosted( data )
			return data
		})
	}
	onChangeText(text) {
		this.setState({text})
	}
	render() {
		const user = this.props.user
		const post = this.props.post
		return <div className="comment-form">
			<form className="message comment" data-ref="replyForm" onSubmit={e => this.onSubmit(e)}>
				<Avatar user={user} />
				<div className="message-header">
					<p className="message-meta">
						<a href={user.link}>{user.name}</a>
						—
						Replying to {post.title.rendered}.
					</p>
				</div>
				<div className="commentcontent message-content">
					<label htmlFor="content" className="assistive-text">Comment</label>
					<FrontKit onChange={(e) => this.onChangeText(e)} />
				</div>
				{this.props.newComment.error ?
					<label className="post-error" htmlFor="content">{this.props.newComment.error.message}</label>
				: null}
				<p className="form-submit">
					<input name="submit" type="submit" className="btn primary" value="Post Comment" />
				</p>
			</form>
		</div>
	}
}

export default connect(s => s)(CommentBox)
