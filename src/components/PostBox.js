import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import FrontKit from 'frontkit'
import Avatar from './Avatar'
import { createPost } from '../actions'

class PostBox extends Component {
	static propTypes = {
		user: PropTypes.object.isRequired,
	}
	constructor() {
		super()
		this.state = {
			text: '',
		}
	}
	onSubmit(e) {
		e.preventDefault()
		this.props.dispatch( createPost({ content: this.state.text }) )
	}
	render() {
		return <div id="postbox" className="postlist active">
			<div className="message">
				<a href={this.props.user.link} className="message-thumb">
					<Avatar user={this.props.user} />
				</a>
				<div className="postcontent message-content">
					<form id="new_post" onSubmit={e => this.onSubmit(e)}>

						<FrontKit />
						{this.props.newPost.error ?
							<label className="post-error" htmlFor="content">{this.props.newPost.error.message}</label>
						: null}
						{!this.props.newPost.isSaving ?
							<div className="postrow">
								<input type="submit" className="btn primary" value="Publish" />
							</div>
						:
							<span className="progress spinner-post-new"></span>
						}
					</form>
				</div>
				<div className="clear"></div>
			</div>
		</div>

	}
}

export default connect(s => s)(PostBox)
