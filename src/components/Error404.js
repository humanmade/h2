import React, { Component } from 'react';

class Error404 extends Component {
	render() {
		const title = this.props.title || '404 Not Found';

		return (
			<div className="Post Error404">
				<div className="Message-Header__byline">
					<h2 className="Message-Header__title">{ title }</h2>
				</div>
				<div className="Message-Main">
					<div className="PostContent">
						{ this.props.children }
						<p><a href={ window.H2Data.site.home }>Return home</a>.</p>
					</div>
				</div>
			</div>
		);
	}
}

export default Error404;
