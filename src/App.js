import React, { Component } from 'react'
import Router from 'react-router-addons-controlled/ControlledBrowserRouter'
import createBrowserHistory from 'history/createBrowserHistory'
const history = createBrowserHistory()
import { connect } from 'react-redux'
import { values, isEmpty } from 'lodash'
import DocumentTitle from 'react-document-title'
import Header from './components/Header'
import PostsList from './components/PostsList'
import Overview from './components/Overview'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import { fetchPosts, updateLocation } from './actions'

class App extends Component {
	componentWillMount() {
		this.props.dispatch( updateLocation( window.location ) ).then( () => {
			this.props.dispatch( fetchPosts(this.props.postsFilter ) )
		})
	}
	onNavigate( location, action ) {
		if ( action !== 'PUSH' ) {
			return;
		}
		// console.log( location.pathname )
		// if ( location.pathname === this.props.location.pathname ) {
		// 	return
		// }
		this.props.dispatch( updateLocation( location ) ).then( () => this.props.dispatch( fetchPosts(this.props.postsFilter ) ) )
	}
	getDocumentTitle() {
		let filter = this.props.postsFilter

		if ( filter.category ) {
			return this.props.categories[ filter.category ].name
		}

		if ( filter.id ) {
			return this.props.posts[ filter.id ].title.rendered
		}

		if ( filter.author ) {
			return this.props.users[ filter.author ].name
		}

		return 'H2'
	}
	render() {
		let posts = values( this.props.posts ).filter( post => {
			let filter = this.props.postsFilter

			if ( filter.id && post.id !== filter.id ) {
				return false;
			}

			if ( filter.category && post.categories.indexOf( filter.category ) === -1 ) {
				return false;
			}

			if ( filter.search ) {
				if ( post.content.rendered.search( RegExp( filter.search, 'i' ) ) === -1 ) {
					return false
				}
			}

			if ( filter.author && post.author !== filter.author ) {
				return false;
			}

			return true;
		})
		return <Router
			history={history}
			location={this.props.location}
			action="PUSH"
			onChange={( location, action) => this.onNavigate( location, action )}
		>
			<div className="App">
				<DocumentTitle title={this.getDocumentTitle()}><span></span></DocumentTitle>
				<Header site={{name: 'h2'}} />
				<div id="wrapper">
					<div className="sleeve sleeve-main">
						<div id="main">
							<Overview user={this.props.user} />
							<PostsList posts={posts} />
						</div>
					</div>
					<Sidebar />
				</div>
				<Footer />
			</div>
		</Router>
	}
}

export default connect(s => s)(App)
