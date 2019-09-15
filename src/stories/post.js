import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { withPadding, withStore } from './decorators';
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
	},
};

storiesOf( 'Content|Post', module )
	.addDecorator( withStore( state ) )
	.addDecorator( withPadding() )
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
		const lengths = [ 3, 4, 5, 6, 7, 8, 9, 10 ];
		return (
			<div style={ { width: '800px' } }>
				{ lengths.map( length => (
					<Post
						key={ length }
						{ ...defaultProps }
						post={ {
							...post,
							title: { rendered: 'mmmmm '.repeat( length ).trim() },
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
