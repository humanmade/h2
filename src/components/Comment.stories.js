import React from 'react';
import { action } from 'storybook/actions';

import { withPadding, withStore } from '../stories/decorators';
import { comment, post, user } from '../stories/stubs';

import { Comment as CommentComponent } from './Comment';
import ActivityMention from './Comment/ActivityMention';
import { WriteComment as WriteCommentComponent } from './Message/WriteComment';

export default {
	title: 'Content/Comments',
	decorators: [
		withStore( { users: { posts: [ user ] } } ),
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

export const ActivityMentions = () => (
	<div>
		<ActivityMention
			comment={ {
				...comment,
				id: 2,
				type: 'mention',
				content: { rendered: 'Shared by <a href="/author/noel/">@noel</a> in <strong>#design</strong> on Slack' },
				mention: { source: 'slack' },
			} }
		/>
		<ActivityMention
			comment={ {
				...comment,
				id: 3,
				type: 'mention',
				content: { rendered: 'Referenced by <a href="/author/human/">@human</a> to answer a question' },
				mention: { source: 'human', icon_url: user.avatar_urls['24'] },
			} }
		/>
	</div>
);
