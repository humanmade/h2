import { action } from '@storybook/addon-actions';
import React, { Fragment } from 'react';

import Button from './Button';
import { withCentering } from '../stories/decorators';

const buttonTypes = [
	'primary',
	'secondary',
	'tertiary',
	'inverted',
];
const buttonSizes = [
	'small',
	'regular',
];

export default {
	title: 'Components|Form/Button',
	decorators: [
		withCentering(),
	],
}

export const All = () => (
	<Fragment>
		{ buttonSizes.map( size => (
			<p key={ size }>
				{ buttonTypes.map( type => (
					<Button
						size={ size }
						type={ type }
						onClick={ action( 'click' ) }
					>
						{ type } { size } button
					</Button>
				) ) }
			</p>
		) ) }
	</Fragment>
);
