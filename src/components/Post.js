import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';

import Avatar from './Avatar';
import Button from './Button';
import PostContent from './PostContent'
import Reactions from '../containers/Reactions'
import { Post as PostType, User } from '../shapes';

import './Post.css';

export default class Post extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			reactions: {}
		}
	}

	render() {
		const props = this.props;

		return <div className="Post">
			<header>
				<Avatar
					url={props.author ? props.author.avatar_urls['96'] : ''}
					size={70}
				/>
				<div className="byline">
					<h2 dangerouslySetInnerHTML={{ __html: props.post.title.rendered }} />
					<div className="date">
						{props.author.name},&nbsp;
						<FormattedRelative value={props.post.date_gmt} />
					</div>
				</div>
				<div className="actions">
					<Button onClick={props.onComment}>Reply</Button>
				</div>
			</header>
			<PostContent html={props.post.content.rendered} />
			{props.children}

			<Reactions
				reactions={ this.state.reactions }
				onChangeReactions={ newReactions => {
					this.setState({ reactions: newReactions })
				} }
			/>
		</div>;
	}
}

Post.propTypes = {
	author: User,
	children: PropTypes.any,
	post: PostType.isRequired,
};
