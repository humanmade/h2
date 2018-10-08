import React from 'react';
import { Slot } from 'react-slot-fill';

import Button from '../Button';

export default function Actions( props ) {
	const { fillProps, isEditing, onEdit, onReply } = props;

	return (
		<div className="actions">
			{ ! isEditing && (
				<Button onClick={ onEdit }>Edit</Button>
			) }
			<Button onClick={ onReply }>Reply</Button>
			<Slot name="Comment.actions" fillChildProps={ fillProps } />
		</div>
	);
}
