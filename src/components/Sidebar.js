import React from 'react'
import SearchBox from './SearchBox'

export default function() {
	return <div className="sidebar">
		<ul>
			<li className="widget widget_search">
				<SearchBox />
			</li>
		</ul>

		<div className="clear"></div>

	</div>
}
