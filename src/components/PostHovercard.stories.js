import React from 'react';

import { withCentering, withStore } from '../stories/decorators';
import { post, user } from '../stories/stubs';
import { Card } from './Hovercard';
import { PostCard, PostCardAuthor } from './PostHovercard';

const commonProps = {
	width: 425,
	positions: {
		left: -212.5,
		top: -100,
	},
};

export default {
	title: 'Components|Hovercard/Post',
	decorators: [
		withStore(),
		withCentering(),
	],
};

export const Basic = () => (
	<Card
		{ ...commonProps }
	>
		<PostCard
			loading={ false }
			post={ post }
			AuthorComponent={ () => (
				<PostCardAuthor
					author={ user }
				/>
			) }
		/>
	</Card>
);

export const Loading = () => (
	<Card
		{ ...commonProps }
	>
		<PostCard
			loading
			post={ null }
			AuthorComponent={ () => (
				<PostCardAuthor
					author={ null }
				/>
			) }
		/>
	</Card>
);

export const WithoutAuthor = () => (
	<Card
		{ ...commonProps }
	>
		<PostCard
			loading={ false }
			post={ post }
			AuthorComponent={ () => (
				<PostCardAuthor
					author={ null }
				/>
			) }
		/>
	</Card>
);

export const NotFound = () => (
	<Card
		{ ...commonProps }
	>
		<PostCard
			loading={ false }
			post={ null }
			AuthorComponent={ () => (
				<PostCardAuthor
					author={ null }
				/>
			) }
		/>
	</Card>
);
