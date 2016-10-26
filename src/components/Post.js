import React, { Component } from 'react'
import { connect } from 'react-redux'
import TimeAgo from 'react-timeago'
import PostReactions from './PostReactions'
import Avatar from './Avatar'
import Comment from './Comment'

class Post extends Component {
	constructor() {
		super()
		this.state = {
			showingComments: true
		}
	}
	render() {
		const post = this.props.post
		const user = this.props.users[ post.author ]
		const comments = post._embedded.replies ? post._embedded.replies[0] : []
		return <div>
			<li className="post">
				<div className="message">
					<div className="message-category">
						{post.categories.map( category => {
							category = this.props.categories[ category ]
							return <a href="" key={category.id} rel="tag">{category.name}</a>
						})}
					</div>

					<a href={user.link} title={user.name} className="message-thumb">
						<Avatar user={user} />
					</a>

					<div className="postcontent message-content">

						<h2 className="message-title">
							<a href={post.link }>{post.title.rendered}</a>
						</h2>

						<div className="message-header">
							<p className="message-meta">
								<a href={user.link} title={user.name}>
									{user.name}
								</a>
								—
								<span className="meta">
									<time dateTime={post.date }><TimeAgo date={post.date} /></time>
								</span>
							</p>
							// post actions
						</div>

						<div className="message-body" dangerouslySetInnerHTML={{__html: post.content.rendered}}></div>
					</div>

					<div className="message-footer">
						{post.tags.length ?
							<p className="tags">
								Tags:
								{post.tags.map( tag => {
									return <a key={tag} href="" rel="tag">{tag}</a>
								})}
							</p>
						: null}
						<PostReactions post={this.props.post} />
					</div>
				</div>

				{comments.length ?
					<div className="discussion">
						<p>
							<a href="#" className="show-comments" onClick={() => this.setState({showingComments:!this.state.showingComments})}>Toggle Comments</a>
						</p>
					</div>
				: null}

				{this.state.showingComments && comments.length ?
					<ul className="children inlinecomments">
						{comments.map( comment => {
							return <Comment key={comment.id} comment={comment} />
						})}
					</ul>
				: null}
			</li>
		</div>
	}
}
export default connect(s => s)( Post )
