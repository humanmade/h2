import React from 'react';
import { Slot } from 'react-slot-fill';

import Button from '../Button';
import ButtonGroup from '../ButtonGroup';
import Dropdown from '../Dropdown';

export default function Actions( props ) {
	const { fillProps, isEditing, onEdit, onReply } = props;

	const renderItems = items => {
		if ( ! items.length && isEditing ) {
			return null;
		}

		return (
			<Dropdown>
				{ ! isEditing && (
					<Button onClick={ onEdit }>Edit</Button>
				) }

				{ items }
			</Dropdown>
		);
	}

	return (
		<ButtonGroup className="actions">
			<Button onClick={ onReply }>Reply</Button>
			<Slot name="Comment.actions" fillChildProps={ fillProps } />
			<Slot
				name="Comment.secondary_actions"
				fillChildProps={ fillProps }
			>
				{ renderItems }
			</Slot>
		</ButtonGroup>
	);
}
