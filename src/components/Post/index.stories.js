import React from 'react';

import { withPadding, withStore } from '../../stories/decorators';
import { comment, editablePost, post, user } from '../../stories/stubs';
import { apiResponse } from '../../stories/util';

import { Post } from './index';

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
	comments: {
		posts: [
			comment,
		],
		archives: {
			[ post.id ]: [
				comment.id,
			],
		},
		archivePages: {
			[ post.id ]: {
				total: 1,
				current: 1,
				// comment.id,
			},
		},
		loadingArchive: [],
		loadingMore: [],
		loadingPost: [],
		saving: [],
	},
	users: {
		posts: [
			user,
		],
		loadingArchive: [],
		loadingPost: [],
		saving: [],
	},
};

export default {
	title: 'Content|Post',
	decorators: [
		withStore( state ),
		withPadding(),
	],
};

export const Basic = () => (
	<Post
		{ ...defaultProps }
	/>
);

export const Collapsed = () => (
	<Post
		{ ...defaultProps }
		expanded={ false }
	/>
);

export const Editable = () => (
	<Post
		{ ...defaultProps }
		editable={ apiResponse( editablePost ) }
	/>
);

export const postTitles = () => {
	const lengths = [ 3, 4, 5, 6, 7, 8, 9, 10 ];
	return (
		<div style={ { width: 800 } }>
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
};
