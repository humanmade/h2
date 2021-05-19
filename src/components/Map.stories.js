import React from 'react';

import { withCentering } from '../stories/decorators';

import Map from './Map';

export default {
	title: 'Components|Map',
	decorators: [
		withCentering(),
	],
};

const commonProps = {
	height: 400,
	location: '-1.5728748,53.1405427',
	width: 400,
};

export const Basic = () => (
	<Map
		{ ...commonProps }
	/>
);

export const Zoomed = () => (
	<Map
		{ ...commonProps }
		zoom={ 6 }
	/>
);
