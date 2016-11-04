import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updatePostsFilter } from '../actions'

class SearchBox extends Component {
	constructor() {
		super()
	}
	onChange(e) {
		e.preventDefault()
		this.props.dispatch( updatePostsFilter({search: e.target.value}) )
	}
	render() {
		return <form role="search" method="get" id="searchform" className="searchform" action="http://h2.hmn.dev/">
			<div>
				<label className="screen-reader-text" htmlFor="s">Search for:</label>
				<input onChange={e => this.onChange(e)} type="text" value={this.props.postsFilter.search ? this.props.postsFilter.search : '' } />
				<input type="submit" id="searchsubmit" value="Search" />
			</div>
		</form>
	}
}
export default connect(s => s)(SearchBox)
