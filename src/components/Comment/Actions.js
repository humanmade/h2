import React from 'react';
import { Slot } from 'react-slot-fill';

import Button from '../Button';
import { Dropdown, DropdownContent } from '../Dropdown';

import './Actions.css';

export default function Actions( props ) {
	const { canEdit, fillProps, isEditing, onEdit, onReply } = props;

	const renderItems = items => {
		if ( ! items.length && ( isEditing || ! canEdit ) ) {
			return null;
		}

		return (
			<DropdownContent>
				{ canEdit && ! isEditing && (
					<Button onClick={ onEdit }>Edit</Button>
				) }

				{ items }
			</DropdownContent>
		);
	}

	return (
		<Dropdown className="Comment-Actions">
			<Button onClick={ onReply }>Reply</Button>
			<Slot
				name="Comment.actions"
				fillChildProps={ fillProps }
			>
				{ renderItems }
			</Slot>
		</Dropdown>
	);
}
