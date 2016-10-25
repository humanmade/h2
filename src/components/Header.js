import React from 'react'

export default function( { site } ) {
	return <div id="header">
		<div className="sleeve">
			<div className="header-inner">
				<h1 className="header-title">
					<a href="/">{site.name}</a>
				</h1>
			</div>
		</div>
	</div>
}
