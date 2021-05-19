import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import { withCentering } from '../../stories/decorators';
import { users } from '../../stories/stubs';

import { MentionCompletion, Item } from './MentionCompletion';

export default {
	title: 'Interface|Editor/Completion/Mention',
	decorators: [
		withCentering(),
	],
};

export const List = () => (
	<ol className="Completion">
		{ users.map( user => (
			<Item
				key={ user.slug }
				item={ user }
				selected={ false }
				onSelect={ action( 'onSelect' ) }
			/>
		) ) }
	</ol>
);

export const Selected = () => (
	<ol className="Completion">
		{ users.map( ( user, index ) => (
			<Item
				key={ user.slug }
				item={ user }
				selected={ index === 1 }
				onSelect={ action( 'onSelect' ) }
			/>
		) ) }
	</ol>
);

export const Interactive = () => {
	const [ value, setValue ] = useState( '' );
	const coords = {
		top: 28,
		left: 0,
	};
	return (
		<form>
			<input
				className="form__field--lg"
				type="text"
				value={ value }
				onChange={ e => setValue( e.target.value ) }
			/>

			<MentionCompletion
				coords={ coords }
				text={ value }
				trigger="@"
				users={ users }
				onSelect={ action( 'select' ) }
			/>
		</form>
	);
};
