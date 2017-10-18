import React from 'react';
import { storiesOf, action } from '@storybook/react';

import DropUpload from '../components/DropUpload';
import Editor from '../components/Editor';

storiesOf( 'Editor/Upload', module )
	.addDecorator( story => <div style={{ margin: '10px' }}>{ story() }</div> )
	.add( 'Base', () => (
		<DropUpload onUpload={ action( 'upload' ) }>
			<p style={{ background: '#eee' }}>DropUpload children.</p>
		</DropUpload>
	) );
