import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Avatar from './Avatar'

class PostBox extends Component {
	static propTypes = {
		user: PropTypes.object.isRequired,
	}
	render() {
		return <div id="postbox" className=" postlist {{#if this.isShowing }} active {{/if}} ">
			<div className="message">
				<a href="{{ esc_url @root.user.link }}" className="message-thumb">
					<Avatar user={this.props.user} />
				</a>
				<div className="postcontent message-content">
					<form id="new_post">
						<textarea />
						<label className="post-error" htmlFor="content"></label>
						<div className="postrow">
							<input type="submit" className="btn primary" value="Publish" />
						</div>
						<span className="progress spinner-post-new"></span>
					</form>
				</div>
				<div className="clear"></div>
			</div>
		</div>

	}
}

export default connect(s => s)(PostBox)
