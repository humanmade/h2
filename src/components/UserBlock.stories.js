import React from 'react';

import { withCentering, withStore } from '../stories/decorators';
import { user } from '../stories/stubs';

import UserBlock from './UserBlock';

export default {
	title: 'Components|UserBlock',
	decorators: [
		withStore(),
		withCentering(),
	],
};

const userWithoutFacts = {
	...user,
	facts: null,
};

export const Basic = () => (
	<UserBlock
		user={ userWithoutFacts }
	/>
);

export const WithFacts = () => (
	<UserBlock
		user={ user }
	/>
);
