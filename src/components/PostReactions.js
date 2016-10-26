import React, { Component, PropTypes } from 'react'

export default class PostReactions extends Component {
	static propTypes = {
		post: PropTypes.object.isRequired,
	}
	render() {
		const reactions = []
		return <span className="h2-reactions">
			{reactions.map( reaction => {
				return <a className="reaction">
					<span className="type">reaction.type</span>
					<span className="count">reaction.count</span>
					<span className="details">
						{reaction.users.map( user => {
							return <span>@{user}</span>
						})}
					</span>
				</a>
			})}

			<button className="reaction add-new" data-ref="addButton">
				<span className="type">😃➕</span>
				<span className="details">
					Add a new reaction.
				</span>
			</button>
		</span>
	}
}
