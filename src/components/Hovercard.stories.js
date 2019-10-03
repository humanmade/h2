import React from 'react';

import Hovercard, { Card } from './Hovercard';
import { withCentering, withStore } from '../stories/decorators';

const commonProps = {
	width: 425,
	positions: {
		left: -212.5,
		top: -100,
	},
};

export default {
	title: 'Components|Hovercard',
	decorators: [
		withStore(),
		// withCentering( { position: 'static' } ),
		withCentering(),
	],
}

export const Base = () => (
	<Card
		{ ...commonProps }
	>
		<p>Card content.</p>
	</Card>
);

export const Interactive = () => (
	<Hovercard
		cardContent={ () => <p>Card content.</p> }
	>
		<a href="http://example.com/">Target element, hover to activate.</a>
	</Hovercard>
);
