import { action } from '@storybook/addon-actions';
import React from 'react';

import { Comment as CommentComponent } from './Comment';
import { WriteComment as WriteCommentComponent } from './Message/WriteComment';
import { withPadding, withStore } from '../stories/decorators';
import { comment, post, user } from '../stories/stubs';

export default {
	title: 'Content|Comments',
	decorators: [
		withStore( {} ),
		withPadding( {
			paddingLeft: 60,
			marginTop: 99,
		} ),
	],
};

export const Comment = () => (
	<CommentComponent
		comment={ comment }
		comments={ [ comment ] }
		parentPost={ post }
		user={ user }
		onDidCreateComment={ action( 'onDidCreateComment' ) }
		onUpdate={ action( 'onUpdate' ) }
	/>
);

export const WriteComment = () => (
	<WriteCommentComponent
		currentUser={ user }
		comment={ comment }
		post={ post }
		onChange={ () => {} }
		onSave={ action( 'save' ) }
		onCancel={ () => {} }
	/>
);
