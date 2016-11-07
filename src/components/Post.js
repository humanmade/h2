import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { values, isEmpty } from 'lodash'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router'
import PostReactions from './PostReactions'
import Avatar from './Avatar'
import Comment from './Comment'
import ReplyBox from './ReplyBox'
import { fetchComments } from '../actions'

class Post extends Component {
	static propTypes = {
		post: PropTypes.object.isRequired,
	}
	constructor() {
		super()
		this.state = {
			showingComments: true,
			isReplying: false,
		}
	}
	onToggleComments() {
		this.setState({showingComments:!this.state.showingComments})
		this.props.dispatch( fetchComments( { post: this.props.post.id }) )
	}
	onEdit() {

	}
	onDelete() {

	}
	render() {
		const post = this.props.post
		const user = this.props.users[ post.author ]
		if ( ! user ) {
			console.error( 'User is not found for post', post )
		}
		const comments = this.props.comments[ post.id ] ? this.props.comments[ post.id ] : {}
		return <li className="post">
			<div className="message">
				<div className="message-category">
					{post.categories.map( category => {
						category = this.props.categories[ category ]
						return <Link to={`/category/${category.slug}/`} key={category.id}>{category.name}</Link>
					})}
				</div>
				<Avatar user={user} />
				<div className="postcontent message-content">
					<h2 className="message-title">
						<Link to={`/post/${post.slug}/`}><span dangerouslySetInnerHTML={{__html: post.title.rendered}} /></Link>
					</h2>
					<div className="message-header">
						<p className="message-meta">
							<Link to={`/author/${user.slug}/`} title={user.name}>
								{user.name}
							</Link>
							—
							<span className="meta">
								<time dateTime={post.date }><TimeAgo date={post.date} /></time>
							</span>
						</p>
						<p className="actions">
							<button onClick={e => this.setState({isReplying: true})}>
								<i className="fa fa-reply"></i>Reply
							</button>
							<button onClick={e => this.onEdit()}>
								<i className="fa fa-edit"></i>Edit
							</button>
							<button onClick={e => this.onDelete()}>
								<i className="fa fa-trash-o"></i>Delete
							</button>
						</p>
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

			<div className="discussion">
				<p>
					<a href="#" className="show-comments" onClick={() => this.onToggleComments()}>Toggle Comments</a>
				</p>
			</div>

			{this.state.showingComments && ! isEmpty( comments ) ?
				<ul className="children inlinecomments">
					{values( comments ).filter( comment => comment.parent === 0 ).map( comment => {
						return <Comment key={comment.id} comment={comment} />
					})}
				</ul>
			: null}

			{this.state.isReplying ?
				<ReplyBox onPosted={() => this.setState({isReplying: false})} post={this.props.post} />
			: null}
		</li>
	}
}
export default connect(s => s)( Post )
