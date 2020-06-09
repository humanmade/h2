import React from 'react';
import { action } from '@storybook/addon-actions';

import { withCentering, withStore } from '../stories/decorators';
import DropUpload from '../components/DropUpload';

export default {
	title: 'Components|DropUpload',
	decorators: [
		withStore(),
		withCentering( { minWidth: '30vw' } ),
	],
};

export const Normal = () => (
	<DropUpload
		files={ [] }
		onCancel={ action( 'onCancel' ) }
		onUpload={ action( 'onUpload' ) }
	>
		<p style={ { background: '#eee' } }>DropUpload children.</p>
	</DropUpload>
);

export const InProgress = () => (
	<DropUpload
		files={ [ { name: 'filename.ext' } ] }
		onCancel={ action( 'onCancel' ) }
		onUpload={ action( 'onUpload' ) }
	>
		<p style={ { background: '#eee' } }>DropUpload children.</p>
	</DropUpload>
);

export const InProgressMultiple = () => (
	<DropUpload
		files={ [ { name: 'filename.ext' }, { name: 'other.ext' } ] }
		onCancel={ action( 'onCancel' ) }
		onUpload={ action( 'onUpload' ) }
	>
		<p style={ { background: '#eee' } }>DropUpload children.</p>
	</DropUpload>
);
InProgressMultiple.story = {
	title: 'In Progress (Multiple)',
};
