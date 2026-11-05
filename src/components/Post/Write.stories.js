import React from 'react';
import { action } from 'storybook/actions';

import { withPadding, withStore } from '../../stories/decorators';
import { post, user } from '../../stories/stubs';

import { WritePost } from './Write';

export default {
	title: 'Content/Post/Write',
	decorators: [
		withStore( { posts: { archives: { [ `drafts/${ user.id }` ]: [] } } } ),
		withPadding(),
	],
};

export const Write = () => (
	<WritePost
		categories={ [] }
		currentUser={ user }
		post={ post }
		onCancel={ action( 'onCancel' ) }
		onCreate={ action( 'onCreate' ) }
		onDidCreatePost={ action( 'onDidCreatePost' ) }
		onUpdate={ action( 'onUpdate' ) }
	/>
);
