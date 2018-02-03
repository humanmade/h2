import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { withApiData } from '../with-api-data';
import { parseResponse } from '../wordpress-rest-api-cookie-auth';

import Avatar from './Avatar';
import Editor from './Editor';

import './WritePost.css';

export class WritePost extends Component {
	state = {
		title:            '',
		showTitleWarning: false,
		category:         null,
		isSubmitting:     false,
	};
	componentDidMount() {
		if ( this.container && this.editor ) {
			this.editor.focus();
			const node = ReactDOM.findDOMNode( this.container );
			if ( node && node.scrollIntoView ) {
				node.scrollIntoView( false );
			}
		}
	}
	onSubmit( content ) {
		if ( ! this.state.title ) {
			this.setState( { showTitleWarning: true } );
			return;
		}

		const body = {
			content,
			status:     'publish',
			title:      this.state.title,
			categories: this.state.category ? [ this.state.category ] : [],
		};

		this.props.fetch( '/wp/v2/posts', {
			headers: {
				Accept:         'application/json',
				'Content-Type': 'application/json',
			},
			body:   JSON.stringify( body ),
			method: 'POST',
		} ).then( r => r.json() ).then( post  => {
			this.setState( { title: '' } )
			this.props.invalidateDataForUrl( '/wp/v2/posts?page=1' );
			this.props.onDidCreatePost( post )
		} );
	}
	onUpload( file ) {
		const options = { method: 'POST' };
		options.body = new FormData();
		options.body.append( 'file', file );

		return this.props.fetch( '/wp/v2/media', options )
			.then( parseResponse );
	}
	render() {
		const user = this.props.user.data;
		const categories = this.props.categories.data || [];
		return <div className="WritePost" ref={ ref => this.container = ref }>
			<header>
				<Avatar
					url={user ? user.avatar_urls['96'] : ''}
					size={60}
				/>
				<div className="byline">
					<h2>
						<input
							type="text"
							placeholder="Enter post title..."
							required
							value={ this.state.title }
							onChange={ e => this.setState( { title: e.target.value, showTitleWarning: false } ) }
						/>
					</h2>
					<span className="date">
						{user ? user.name : ''}, now
					</span>
					{categories.length > 0 &&
						<select onChange={ e => this.setState( { category: e.target.value } ) } value={ this.state.cateogry } className="categories">
							<option key="none" value={null}>- Category-</option>
							{categories.map( category => (
								<option key={category.id} value={category.id}>{ category.name }</option>
							) ) }
						</select>
					}
				</div>
				<div className="actions"></div>
			</header>
			<Editor
				ref={editor => this.editor = editor ? editor.getWrappedInstance() : null}
				submitText={ this.state.isSubmitting ? 'Publishing...' : 'Publish' }
				onCancel={this.props.onCancel}
				onSubmit={( ...args ) => this.onSubmit( ...args )}
				onUpload={( ...args ) => this.onUpload( ...args )}
			/>
			{ this.state.showTitleWarning ?
				<p className="WritePost-title-warn">
					<span role="img" aria-label="Warning">⚠️</span> Your post needs a title!
				</p>
			: null }
			{this.props.children}
		</div>
	}
}

WritePost.propTypes = {
	onCancel:    PropTypes.func.isRequired,
	onDidCreatePost: PropTypes.func.isRequired,
};

export default withApiData( props => ( {
	user:       '/wp/v2/users/me',
	categories: '/wp/v2/categories',
} ) )( WritePost )
