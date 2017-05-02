// @flow
import React from 'react';
import './WritePost.css';
import '@humanmade/frontkit/dist/style.css';
import type { User, Post } from '../types';
import Avatar from './Avatar';
import Button from './Button';
import FrontKit, { plugins } from '@humanmade/frontkit';
import { FormattedRelative } from 'react-intl';

export default function WritePost(
	props: {
		post: Post,
		author: ?User,
		onChange: Object => mixed,
		onCancel: () => mixed,
		onSave: () => mixed,
	}
) {
	return (
		<div className="WritePost">
			<div>
				<Avatar
					url={props.author ? props.author.avatar_urls['96'] : ''}
					size={70}
				/>
				<div className="body">
					<h2><input onChange={e => props.onChange({ title: { edited: e.target.value } })} value={props.post.title.edited} placeholder="Enter title..." /></h2>
					<div className="date">
						<FormattedRelative value={props.post.date_gmt} />
					</div>
					<FrontKit
						placeholder="Start writing..."
						value={props.post.content.edited}
						onChange={edited => props.onChange({ content: { edited } })}
					>
						<plugins.Bubble />
						<plugins.InlineBubble />
						<plugins.Dots />
						<plugins.MarkdownShortcuts />
					</FrontKit>
					<span className="buttons">
						<Button onClick={props.onCancel}>Cancel</Button>
						<Button onClick={props.onSave}>Publish</Button>
					</span>
				</div>
			</div>
		</div>
	);
}
