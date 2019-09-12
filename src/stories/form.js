import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React, { Fragment } from 'react';

import { withPadding } from './decorators';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';

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
	) )
	.add( 'Button Group', () => (
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
	) );
