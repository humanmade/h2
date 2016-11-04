import React from 'react'
import { Link } from 'react-router'

export default function( { site } ) {
	return <div id="header">
		<div className="sleeve">
			<div className="header-inner">
				<h1 className="header-title">
					<Link to="/">{site.name}</Link>
				</h1>
			</div>
		</div>
	</div>
}
