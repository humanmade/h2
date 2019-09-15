import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { withPadding, withStore } from './decorators';
import { users } from './stubs';
import Editor from '../components/Editor';

storiesOf( 'Editor', module )
	.addDecorator( withStore( {} ) )
	.addDecorator( withPadding() )
	.add( 'Editor', () => (
		<Editor
			onSubmit={ action( 'onSubmit' ) }
			users={ users }
		/>
	) );
