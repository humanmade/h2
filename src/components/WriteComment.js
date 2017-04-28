// @flow
import React from 'react';
import './WriteComment.css';
import '@humanmade/frontkit/dist/style.css';
import type { User, Post, Comment } from '../types';
import Avatar from './Avatar';
import Button from './Button';
import FrontKit, { plugins } from '@humanmade/frontkit';

export default function WriteComment(
	props: {
		post: Post,
		author: ?User,
		comment: Comment,
		onChange: Object => mixed,
		onCancel: () => mixed,
		onSave: () => mixed,
	}
) {
	return (
		<div className="WriteComment">
			<Avatar
				url={props.author ? props.author.avatar_urls['96'] : ''}
				size={50}
			/>
			<div className="body">
				<header>
					<strong>{props.author ? props.author.name : ''}</strong>
				</header>
				<FrontKit
					placeholder="Start writing..."
					value={props.comment.content.edited}
					onChange={edited => props.onChange({ content: { edited } })}
				>
					<plugins.Bubble />
					<plugins.InlineBubble />
					<plugins.Dots />
					<plugins.MarkdownShortcuts />
				</FrontKit>
				<span className="buttons">
					<Button onClick={props.onCancel}>Cancel</Button>
					<Button onClick={props.onSave}>Save</Button>
				</span>
			</div>
		</div>
	);
}
