import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { withStore } from './decorators';
import { users } from './stubs';
import Editor from '../components/Editor';
import DropUpload from '../components/DropUpload';

storiesOf( 'Editor', module )
	.addDecorator( withStore( {} ) )
	.add( 'Editor', () => (
		<Editor
			onSubmit={ action( 'submit' ) }
			users={ users }
		/>
	) );

storiesOf( 'Editor/Upload', module )
	.addDecorator( withStore( {} ) )
	.addDecorator( story => <div style={ { margin: '10px' } }>{ story() }</div> )
	.add( 'Normal', () => (
		<DropUpload
			onCancel={ action( 'upload' ) }
			onUpload={ action( 'upload' ) }
		>
			<p style={ { background: '#eee' } }>DropUpload children.</p>
		</DropUpload>
	) )
	.add( 'In Progress', () => (
		<DropUpload
			file={ { name: 'filename.ext' } }
			onCancel={ action( 'upload' ) }
			onUpload={ action( 'upload' ) }
		>
			<p style={ { background: '#eee' } }>DropUpload children.</p>
		</DropUpload>
	) );
