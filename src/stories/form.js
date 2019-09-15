import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React, { Fragment } from 'react';

import { withCentering } from './decorators';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';
import { Dropdown, DropdownContent } from '../components/Dropdown';

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
	.addDecorator( withCentering() )
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
					) ) }
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
	) )
	.add( 'Dropdown', () => (
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
	) );
