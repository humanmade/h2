import React from 'react';

import { withCentering, withStore } from '../stories/decorators';
import { user } from '../stories/stubs';

import { Card } from './Hovercard';
import { UserCard } from './UserHovercard';

const commonProps = {
	width: 425,
	positions: {
		left: -212.5,
		top: -100,
	},
};

export default {
	title: 'Components|Hovercard/User',
	decorators: [
		withStore(),
		withCentering(),
	],
};

export const Basic = () => (
	<Card
		{ ...commonProps }
	>
		<UserCard
			user={ user }
		/>
	</Card>
);
