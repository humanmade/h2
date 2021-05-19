import React from 'react';

import { withCentering, withStore } from '../stories/decorators';

import Avatar from './Avatar';

export default {
	title: 'Components|Avatar',
	decorators: [
		withStore(),
		withCentering(),
	],
};

export const Size32 = () => (
	<Avatar
		size={ 32 }
		url="https://secure.gravatar.com/avatar/0ceb885cc3d306af93c9764b2936d618?s=300&d=mm&r=g"
	/>
);
