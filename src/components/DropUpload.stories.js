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
}

export const Normal = () => (
	<DropUpload
		files={ [] }
		onCancel={ action( 'onCancel' ) }
		onUpload={ action( 'onUpload' ) }
	>
		<p style={ { background: '#eee' } }>DropUpload children.</p>
	</DropUpload>
);

export const Progress = () => (
	<DropUpload
		files={ [ { name: 'filename.ext' } ] }
		onCancel={ action( 'onCancel' ) }
		onUpload={ action( 'onUpload' ) }
	>
		<p style={ { background: '#eee' } }>DropUpload children.</p>
	</DropUpload>
);
Progress.story = {
	title: 'In Progress',
};

export const ProgressMulti = () => (
	<DropUpload
		files={ [ { name: 'filename.ext' }, { name: 'other.ext' } ] }
		onCancel={ action( 'onCancel' ) }
		onUpload={ action( 'onUpload' ) }
	>
		<p style={ { background: '#eee' } }>DropUpload children.</p>
	</DropUpload>
);
ProgressMulti.story = {
	title: 'In Progress (Multiple)',
};
