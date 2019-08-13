import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { withStore } from './decorators';
import { comment, editablePost, post, user } from './stubs';
import { apiResponse } from './util';
import { Post } from '../components/Post';
import { WritePost } from '../components/Post/Write';

const defaultProps = {
	user: user,
	categories: apiResponse( [] ),
	post,
};

const state = {
	posts: {
		posts: [ post ],

		// TODO: fix this in Repress.
		archivePages: {},
		loadingArchive: [],
		loadingMore: [],
	}
};

storiesOf( 'Post', module )
	.addDecorator( withStore( state ) )
	.add( 'Post', () => (
		<Post
			{ ...defaultProps }
		/>
	) )
	.add( 'Post (Collapsed)', () => (
		<Post
			{ ...defaultProps }
			expanded={ false }
		/>
	) )
	.add( 'Post (Editable)', () => (
		<Post
			{ ...defaultProps }
			editable={ apiResponse( editablePost ) }
		/>
	) )
	.add( 'Post (With Comments)', () => (
		<Post
			{ ...defaultProps }
			comments={ apiResponse( [ comment ] ) }
		/>
	) )
	.add( 'Post Titles', () => {
		const lengths = [ 20, 22, 24, 26, 28, 30, 32, 34 ];
		return (
			<div style={ { width: '800px' } }>
				{ lengths.map( length => (
					<Post
						key={ length }
						{ ...defaultProps }
						post={ {
							...post,
							title: { rendered: 'm'.repeat( length ) },
							content: { rendered: `Post with title of length ${ length }` },
						} }
					/>
				) ) }
			</div>
		);
	} )
	.add( 'WritePost', () => (
		<WritePost
			categories={ [] }
			currentUser={ user }
			post={ post }
			onCancel={ action( 'onCancel' ) }
			onCreate={ action( 'onCreate' ) }
			onDidCreatePost={ action( 'onDidCreatePost' ) }
			onUpdate={ action( 'onUpdate' ) }
		/>
	) );
