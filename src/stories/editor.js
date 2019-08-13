import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { withPadding, withStore } from './decorators';
import { users } from './stubs';
import Editor from '../components/Editor';
import DropUpload from '../components/DropUpload';

storiesOf( 'Editor', module )
	.addDecorator( withStore( {} ) )
	.add( 'Editor', () => (
		<Editor
			onSubmit={ action( 'onSubmit' ) }
			users={ users }
		/>
	) );

storiesOf( 'Editor/Upload', module )
	.addDecorator( withStore( {} ) )
	.addDecorator( withPadding )
	.add( 'Normal', () => (
		<DropUpload
			files={ [] }
			onCancel={ action( 'onCancel' ) }
			onUpload={ action( 'onUpload' ) }
		>
			<p style={ { background: '#eee' } }>DropUpload children.</p>
		</DropUpload>
	) )
	.add( 'In Progress', () => (
		<DropUpload
			files={ [ { name: 'filename.ext' } ] }
			onCancel={ action( 'onCancel' ) }
			onUpload={ action( 'onUpload' ) }
		>
			<p style={ { background: '#eee' } }>DropUpload children.</p>
		</DropUpload>
	) )
	.add( 'In Progress (Multiple)', () => (
		<DropUpload
			files={ [ { name: 'filename.ext' }, { name: 'other.ext' } ] }
			onCancel={ action( 'onCancel' ) }
			onUpload={ action( 'onUpload' ) }
		>
			<p style={ { background: '#eee' } }>DropUpload children.</p>
		</DropUpload>
	) );
