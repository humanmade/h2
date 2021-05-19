import React, { Fragment } from 'react';

import { withCentering } from '../stories/decorators';

import Button from './Button';
import ButtonGroup from './ButtonGroup';

export default {
	title: 'Components|Form/Button/Group',
	decorators: [
		withCentering(),
	],
};

const buttonTypes = [
	'primary',
	'secondary',
	'tertiary',
	'inverted',
];
export const All = () => (
	<Fragment>
		{ buttonTypes.map( type => (
			<p key={ type }>
				<ButtonGroup>
					<Button type={ type }>First</Button>
					<Button type={ type }>Second</Button>
					<Button type={ type }>Third</Button>
					<Button type={ type }>Forth</Button>
				</ButtonGroup>
			</p>
		) ) }
	</Fragment>
);
