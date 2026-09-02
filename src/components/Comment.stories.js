import { action } from '@storybook/addon-actions';
import React from 'react';

import { withPadding, withStore } from '../stories/decorators';
import { comment, post, user } from '../stories/stubs';

import { Comment as CommentComponent } from './Comment';
import HumanMention from './Comment/HumanMention';
import SlackMention from './Comment/SlackMention';
import { WriteComment as WriteCommentComponent } from './Message/WriteComment';

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

export const ActivityMentions = () => (
	<div>
		<SlackMention
			comment={ {
				...comment,
				id: 2,
				type: 'slack_mention',
				slack: {
					channel_name: 'design',
					permalink: 'https://humanmade.slack.com/archives/CDEMO/p1234567890',
					shared_by: 'Noel',
					shared_by_id: 1,
					shared_by_username: 'noel',
					source: 'manual',
					visibility: 'public',
				},
			} }
		/>
		<HumanMention
			comment={ {
				...comment,
				id: 3,
				type: 'human_mention',
				human: {
					asker: 'Noel',
					asker_id: 1,
					asker_username: 'noel',
					question_url: 'https://humanmade.slack.com/archives/CDEMO/p1234567891',
				},
			} }
		/>
	</div>
);
