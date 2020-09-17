import React from 'react';

import { withCentering, withStore } from '../stories/decorators';
import { Card } from './Hovercard';
import TimeHovercard, { TimeCard } from './TimeHovercard';

const commonProps = {
	width: 425,
	positions: {
		left: -212.5,
		top: -100,
	},
};

export default {
	title: 'Components|Hovercard/Time',
	decorators: [
		withStore(),
		withCentering(),
	],
};

export const Basic = () => (
	<Card
		{ ...commonProps }
	>
		<TimeCard
			date={ new Date( '2020-01-01T00:00:00Z' ) }
			original="Jan 1, 2020"
		/>
	</Card>
);

export const Future = () => (
	<Card
		{ ...commonProps }
	>
		<TimeCard
			date={ new Date( '2030-01-01T00:00:00Z' ) }
			original="Jan 1, 2030"
		/>
	</Card>
);

export const WithTimezone = () => (
	<Card
		{ ...commonProps }
	>
		<TimeCard
			date={ new Date( '2030-01-01T00:00:00+10:00' ) }
			original="Jan 1, 2030"
		/>
	</Card>
);

export const Interactive = () => (
	<TimeHovercard
		dateTime="2030-01-01T00:00:00Z"
	>
		Jan 1, 2030
	</TimeHovercard>
);

export const Unparseable = () => (
	<TimeHovercard
		dateTime="NOT-A-DATE"
	>
		Jan 1, 2030
	</TimeHovercard>
);
