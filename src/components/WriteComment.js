// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import './WriteComment.css';
import '@humanmade/frontkit/dist/style.css';
import type { User, Post, Comment } from '../types';
import Avatar from './Avatar';
import Button from './Button';
import FrontKit, { plugins } from '@humanmade/frontkit';

export default class WriteComment extends React.Component {
	props: {
		post: Post,
		author: ?User,
		comment: Comment,
		onChange: Object => mixed,
		onCancel: () => mixed,
		onSave: () => mixed,
	};

	componentDidMount() {
		if ( this.container && this.editor ) {
			this.editor.focus();
			const node = ReactDOM.findDOMNode( this.container );
			if ( node && node.scrollIntoView ) {
				node.scrollIntoView( false );
			}
		}
	}

	render() {
		return (
			<div className="WriteComment" ref={ ref => this.container = ref }>
				<Avatar
					url={this.props.author ? this.props.author.avatar_urls['96'] : ''}
					size={50}
				/>
				<div className="body">
					<header>
						<strong>{this.props.author ? this.props.author.name : ''}</strong>
					</header>
					<FrontKit
						placeholder="Start writing..."
						ref={ ref => this.editor = ref }
						value={this.props.comment.content.edited}
						onChange={edited => this.props.onChange({ content: { edited } })}
					>
						<plugins.Bubble />
						<plugins.InlineBubble />
						<plugins.Dots />
						<plugins.MarkdownShortcuts />
					</FrontKit>
					<span className="buttons">
						<Button onClick={this.props.onCancel}>Cancel</Button>
						<Button onClick={this.props.onSave}>Save</Button>
					</span>
				</div>
			</div>
		);
	}
}
