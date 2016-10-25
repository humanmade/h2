import React from 'react'

export default function() {
	return <form role="search" method="get" id="searchform" className="searchform" action="http://h2.hmn.dev/">
		<div>
			<label className="screen-reader-text" htmlFor="s">Search for:</label>
			<input type="text" value="" name="s" id="s" />
			<input type="submit" id="searchsubmit" value="Search" />
		</div>
	</form>
}
