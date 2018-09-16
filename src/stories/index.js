import React from 'react';
import { storiesOf, action } from '@storybook/react';

import { comment, post, user } from './stubs';
import Avatar from '../components/Avatar';
import Post from '../components/Post';
import Comment from '../components/Comment';
import WriteComment from '../components/Message/WriteComment';
import WritePost from '../components/Post/Write';

import '../hm-pattern-library/assets/styles/juniper.css';

storiesOf( 'Components', module )
	.add( 'Avatar', () => (
		<Avatar
			size={ 32 }
			url="https://secure.gravatar.com/avatar/0ceb885cc3d306af93c9764b2936d618?s=300&d=mm&r=g"
		/>
	) )
	.add( 'Post', () => <Post author={ user } post={ post } /> )
	.add( 'Post Titles', () => {
		const lengths = [ 20, 22, 24, 26, 28, 30, 32, 34 ];
		return (
			<div style={ { width: '800px' } }>
				{ lengths.map( length => (
					<Post
						author={ user }
						categories={ [] }
						post={ {
							...post,
							title: { rendered: 'm'.repeat( length ) },
							content: { rendered: `Post with title of length ${ length }` },
						} }
					/>
				) ) }
			</div>
		);
	} )
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
	.add( 'WritePost', () => (
		<WritePost
			author={ user }
			post={ post }
			onChange={ () => {} }
			onSave={ () => {} }
			onCancel={ () => {} }
		/>
	) )
