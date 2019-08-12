import React from 'react';
import { storiesOf, action } from '@storybook/react';

import { comment, post, user } from './stubs';
import Avatar from '../components/Avatar';
import Comment from '../components/Comment';
import WriteComment from '../components/Message/WriteComment';

import '../hm-pattern-library/assets/styles/juniper.css';

storiesOf( 'Components', module )
	.add( 'Avatar', () => (
		<Avatar
			size={ 32 }
			url="https://secure.gravatar.com/avatar/0ceb885cc3d306af93c9764b2936d618?s=300&d=mm&r=g"
		/>
	) )
	.add( 'Comment', () => <Comment author={ user } comment={ comment } /> )
	.add( 'WriteComment', () => (
		<WriteComment
			author={ user }
			comment={ comment }
			post={ post }
			onChange={ () => {} }
			onSave={ action( 'save' ) }
			onCancel={ () => {} }
		/>
	) )
