import React from 'react';

import UserBlock from './UserBlock';
import { withCentering, withStore } from '../stories/decorators';
import { user } from '../stories/stubs';

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
