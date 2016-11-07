import React, { Component } from 'react'
import { connect } from 'react-redux'
import { values } from 'lodash'
import TimeAgo from 'react-timeago'
import ReplyBox from './ReplyBox'
import Avatar from './Avatar'

class Comment extends Component {
	constructor() {
		super()
		this.state = {
			isReplying: false,
		}
	}
	render() {
		const comment = this.props.comment
		const user = this.props.users[ comment.author ]
		const post = this.props.posts[ comment.post ]
		const comments = this.props.comments[ post.id ] ? values( this.props.comments[ post.id ] ) : []
		return <li className="comment">
			<div className="message">
				<Avatar user={user} />
				<div className="message-header">
					<p className="message-meta">
						<a href={user.link}>{user.name}</a>
						&ndash;
						<span className="meta">
							<time dateTime={comment.date }><TimeAgo date={comment.date} /></time>
						</span>
					</p>
					<p className="actions">
						<button onClick={e => this.setState({isReplying: true})}>
							<i className="fa fa-reply"></i>Reply
						</button>
					</p>
				</div>
				<div className="commentcontent message-content" dangerouslySetInnerHTML={{__html:comment.content.rendered}}></div>
				<div className="message-footer"></div>
			</div>
			{comments.length ?
				<ul className="children inlinecomments">
					{comments.filter( c => c.parent === comment.id ).map( c => {
						return <CommentConnected key={c.id} comment={c} />
					})}
				</ul>
			: null}
			{this.state.isReplying ?
				<ReplyBox comment={comment} onPosted={() => this.setState({isReplying: false})} post={post} />
			: null}
		</li>
	}
}
// Hack to allow using the connected component within this Component
let CommentConnected
export default CommentConnected = connect(s => s)(Comment)
