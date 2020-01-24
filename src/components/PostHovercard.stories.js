import React from 'react';

import { withCentering, withStore } from '../stories/decorators';
import { post, user } from '../stories/stubs';
import { Card } from './Hovercard';
import { PostCard } from './PostHovercard';

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
}

export const Basic = () => (
	<Card
		{ ...commonProps }
	>
		<PostCard
			author={ user }
			post={ post }
		/>
	</Card>
);

export const WithoutAuthor = () => (
	<Card
		{ ...commonProps }
	>
		<PostCard
			author={ null }
			post={ post }
		/>
	</Card>
);
