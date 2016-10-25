import React, { Component, PropTypes } from 'react'
import PostBox from './PostBox'

export default class Overview extends Component {
	static propTypes = {
		user: PropTypes.object.isRequired,
	}
	constructor() {
		super()
		this.state = {
			showingPostBox: false,
		}
	}
	render() {
		return <div id="overview-container">
			<div className="overview message">
				<span className="message-thumb">
					<i className="fa fa-newspaper-o"></i>
				</span>
				<div className="overview-content">
					<p>
						Hi {this.props.user.name}!
						You're wonderful. More H2 updates coming soon.
					</p>
					<button type="button" className="btn btn-new-post" onClick={e => this.setState({showingPostBox:!this.state.showingPostBox})}>
						<i className="fa fa-plus"></i>
						New Post
					</button>
				</div>
			</div>
			{this.state.showingPostBox ?
				<PostBox user={this.props.user} />
			: null}
		</div>
	}
}
