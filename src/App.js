import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from './components/Header'
import PostsList from './components/PostsList'
import Overview from './components/Overview'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import { fetchPosts } from './actions'

class App extends Component {
	componentWillMount() {
		this.props.dispatch( fetchPosts({per_page: 1}) )
	}
	render() {
		return <div className="App">
			<Header site={{name: 'h2'}} />
			<div id="wrapper">
				<div className="sleeve sleeve-main">
					<div id="main">
						<Overview user={this.props.user} />
						<PostsList posts={this.props.posts} />
					</div>
				</div>
				<Sidebar />
			</div>
			<Footer />
		</div>
	}
}

export default connect(s => s)(App)
