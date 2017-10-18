import React from 'react';
import { storiesOf, action } from '@storybook/react';

import DropUpload from '../components/DropUpload';
import Editor from '../components/Editor';

storiesOf( 'Editor/Upload', module )
	.addDecorator( story => <div style={{ margin: '10px' }}>{ story() }</div> )
	.add( 'Normal', () => (
		<DropUpload
			onCancel={ action( 'upload' ) }
			onUpload={ action( 'upload' ) }
		>
			<p style={{ background: '#eee' }}>DropUpload children.</p>
		</DropUpload>
	) )
	.add( 'In Progress', () => (
		<DropUpload
			file={ { name: 'filename.ext' } }
			onCancel={ action( 'upload' ) }
			onUpload={ action( 'upload' ) }
		>
			<p style={{ background: '#eee' }}>DropUpload children.</p>
		</DropUpload>
	) );
