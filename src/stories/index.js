import React from 'react';
import { storiesOf, action } from '@storybook/react';

import rootDecorator from './root-decorator';
import Header from '../components/Header';
import Logo from '../components/Header/Logo';
import Avatar from '../components/Avatar';
import Editor from '../components/Editor';
import Status from '../components/Status';
import Post from '../components/Post';
import Comment from '../components/Comment';
import WriteComment from '../components/Message/WriteComment';
import WritePost from '../components/Post/Write';

import '../hm-pattern-library/assets/styles/juniper.css';

const comment = {
	id: 1,
	post: 1,
	date_gmt: new Date().toISOString(),
	author: 1,
	content: {
		rendered: 'Heading up to Oregon for my brother and sister-in-law’s birthday celebrations! I’ll be out May 4-7!',
		raw: 'awd',
	},
};

const post = {
	id: 1,
	date_gmt: new Date().toISOString(),
	author: 1,
	title: { rendered: 'Exploring the idea of Platform' },
	content: { rendered: 'Heading up to Oregon for my brother and sister-in-law’s birthday celebrations! I’ll be out May 4-7!' },
	related: {
		comments: {
			items: [],
			isLoading: false,
			hasLoaded: false,
		},
	},
};

const user = {
	name: 'Noel',
	slug: 'noel',
	avatar_urls: {
		'48': 'https://secure.gravatar.com/avatar/c57c8945079831fa3c19caef02e44614?s=48&d=mm&r=g',
		'96': 'https://secure.gravatar.com/avatar/c57c8945079831fa3c19caef02e44614?s=96&d=mm&r=g',
	},
};

const users = [
	user,
	{
		...user,
		name: 'Joe',
		slug: 'joe',
	},
	{
		...user,
		name: 'Tom',
		slug: 'tomwillmot',
	},
];

storiesOf( 'Components', module )
	.addDecorator( rootDecorator() )
	.add( 'Header', () => (
		<Header onWritePost={ () => {} } onWriteStatus={ () => {} }><Logo /></Header>
	) )
	.add( 'Logo', () => <Logo /> )
	.add( 'Avatar', () => (
		<Avatar
			size={ 32 }
			url="https://secure.gravatar.com/avatar/0ceb885cc3d306af93c9764b2936d618?s=300&d=mm&r=g"
		/>
	) )
	.add( 'Status', () => <Status author={ user } post={ post } /> )
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
	.add( 'Editor', () => (
		<Editor
			onSubmit={ action( 'submit' ) }
			users={ users }
		/>
	) );
