import React from 'react';

import Notification from './Notification';
import { withCentering } from '../stories/decorators';

export default {
	title: 'Components|Notification',
	decorators: [
		withCentering( { minWidth: '40vw' } ),
	],
}

export const status = () => (
	<Notification type="status">
		Notification text here.
	</Notification>
);

export const alert = () => (
	<Notification type="alert">
		Notification text here.
	</Notification>
);

export const error = () => (
	<Notification type="error">
		Notification text here.
	</Notification>
);

