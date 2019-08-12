import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { comment, post, user } from './stubs';
import withStore from './withStore';
import { Comment } from '../components/Comment';
import WriteComment from '../components/Message/WriteComment';

storiesOf( 'Comments', module )
	.addDecorator( withStore( {} ) )
	.add( 'Comment', () => (
		<Comment
			author={ user }
			comment={ comment }
			comments={ [ comment ] }
			parentPost={ post }
			onDidCreateComment={ action( 'onDidCreateComment' ) }
			onUpdate={ action( 'onUpdate' ) }
		/>
	) )
	.add( 'WriteComment', () => (
		<WriteComment
			author={ user }
			comment={ comment }
			post={ post }
			onChange={ () => {} }
			onSave={ action( 'save' ) }
			onCancel={ () => {} }
		/>
	) );
