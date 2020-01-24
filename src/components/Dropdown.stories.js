import { action } from '@storybook/addon-actions';
import React from 'react';

import Button from './Button';
import { Dropdown, DropdownContent } from './Dropdown';
import { withCentering } from '../stories/decorators';

const buttonTypes = [
	'primary',
	'secondary',
	'tertiary',
	'inverted',
];

export default {
	title: 'Components|Form/Dropdown',
	decorators: [
		withCentering(),
	],
}

export const All = () => (
	<div
		style={ {
			display: 'flex',
			justifyContent: 'center',
			flexDirection: 'column',
			maxWidth: '20rem',
		} }
	>
		{ buttonTypes.map( type => (
			<div style={ { marginBottom: '1em' } }>
				<Dropdown
					type={ type }
				>
					<Button
						type={ type }
						onClick={ action( 'main' ) }
					>
						{ type } button
					</Button>
					<DropdownContent>
						<Button onClick={ action( 'test' ) }>Test...</Button>
						<Button onClick={ action( 'long' ) }>This is a much longer action name</Button>
					</DropdownContent>
				</Dropdown>
			</div>
		) ) }
	</div>
);
