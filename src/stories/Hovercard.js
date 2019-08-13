import React from 'react';
import { storiesOf } from '@storybook/react';

import { withStore } from './decorators';
import { user } from './stubs';
import Hovercard, { Card } from '../components/Hovercard';
import UserHovercard, { UserCard } from '../components/UserHovercard';

const commonProps = {
	positions: {
		left: 100,
		top: 10,
	},
};

storiesOf( 'Components/Hovercard' )
	.addDecorator( withStore( {} ) )
	.add( 'Base', () => (
		<div>
			<Card
				{ ...commonProps }
			>
				<p>Card content.</p>
			</Card>
		</div>
	) )
	.add( 'Base (interactive)', () => (
		<Hovercard
			cardContent={ () => <p>Card content.</p> }
		>
			<a>Target element, hover to activate.</a>
		</Hovercard>
	) )
	.add( 'User', () => (
		<Card
			{ ...commonProps }
		>
			<UserCard
				user={ user }
			/>
		</Card>
	) );
