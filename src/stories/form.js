import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React, { Fragment } from 'react';

import { withPadding } from './decorators';
import Button from '../components/Button';

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
storiesOf( 'Components/Form' )
	.addDecorator( withPadding )
	.add( 'Button', () => (
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
					))}
				</p>
			) ) }
		</Fragment>
	) );
