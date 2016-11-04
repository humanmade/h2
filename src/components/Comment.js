import React, { Component } from 'react'
import { connect } from 'react-redux'
import TimeAgo from 'react-timeago'
import ReplyBox from './ReplyBox'
import Avatar from './Avatar'

class Comment extends Component {
	constructor() {
		super()
		this.state = {
			showingComments: false
		}
	}
	render() {
		const comment = this.props.comment
		const user = this.props.users[ comment.author ]
		const post = this.props.post[ comment.post ]
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
					// actions
				</div>
				<div className="commentcontent message-content" dangerouslySetInnerHTML={{__html:comment.content.rendered}}></div>
				<div className="message-footer"></div>
			</div>
			<ul className="children">

			</ul>
			<ReplyBox post={post} />
		</li>
	}
}

export default connect(s => s)(Comment)
