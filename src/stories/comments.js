import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { withPadding, withStore } from './decorators';
import { comment, post, user } from './stubs';
import { Comment } from '../components/Comment';
import WriteComment from '../components/Message/WriteComment';

storiesOf( 'Comments', module )
	.addDecorator( withStore( {} ) )
	.addDecorator( withPadding( {
		paddingLeft: 60,
		marginTop: 99,
	} ) )
	.add( 'Comment', () => (
		<Comment
			comment={ comment }
			comments={ [ comment ] }
			parentPost={ post }
			user={ user }
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
