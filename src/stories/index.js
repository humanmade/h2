// @flow

import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import scss from '../index.css';
import Header from '../components/Header';
import Logo from '../components/Logo';
import Avatar from '../components/Avatar';
import Status from '../components/Status';
import Post from '../components/Post';
import PostsList from '../components/PostsList';
import Comment from '../components/Comment';

storiesOf('Components', module)
	.add('Header', () => <Header><Logo /></Header>)
	.add('Logo', () => <Logo />)
	.add('Avatar', () => (
		<Avatar
			size={32}
			url="https://secure.gravatar.com/avatar/0ceb885cc3d306af93c9764b2936d618?s=300&d=mm&r=g"
		/>
	))
	.add('Status', () => (
		<Status
			author={{
				name: 'Nathaniel',
				avatar_urls: {
					'96': 'https://secure.gravatar.com/avatar/0ceb885cc3d306af93c9764b2936d618?s=300&d=mm&r=g',
				},
			}}
			post={{
				title: {
					rendered: '',
				},
				author: 1,
				id: 1,
				content: {
					rendered: 'Heading up to Oregon for my brother and sister-in-law’s birthday celebrations! I’ll be out May 4-7!',
				},
			}}
		/>
	))
	.add('Post', () => (
		<Post
			author={{
				name: 'Noel',
				avatar_urls: {
					'96': 'https://secure.gravatar.com/avatar/c57c8945079831fa3c19caef02e44614?s=300&d=mm&r=g',
				},
			}}
			post={{
				id: 1,
				author: 1,
				title: {
					rendered: 'Exploring the idea of Platform',
				},
				content: {
					rendered: 'Heading up to Oregon for my brother and sister-in-law’s birthday celebrations! I’ll be out May 4-7!',
				},
			}}
		/>
	))
	.add('Comment', () => (
		<Comment
			author={{
				name: 'Noel',
				avatar_urls: {
					'96': 'https://secure.gravatar.com/avatar/c57c8945079831fa3c19caef02e44614?s=300&d=mm&r=g',
				},
			}}
			comment={{
				id: 1,
				author: 1,
				content: {
					rendered: 'Heading up to Oregon for my brother and sister-in-law’s birthday celebrations! I’ll be out May 4-7!',
				},
			}}
		/>
	));
