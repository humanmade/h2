import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';

import Avatar from './Avatar';
import Button from './Button';
import PostContent from './PostContent'
import Reactions from '../containers/Reactions'
import { Post as PostType, User, Category } from '../shapes';

import './Post.css';

// import api from './api';

export default class Post extends Component {
	constructor( props ) {
		super( props );

		this.state = { reactions: {} }
	}

	render() {
		const props = this.props;

		return <div className="Post">
			<header>
				<Avatar
					url={props.author ? props.author.avatar_urls['96'] : ''}
					size={60}
				/>
				<div className="byline">
					<h2 dangerouslySetInnerHTML={{ __html: props.post.title.rendered }} />
					<span className="date">
						{props.author ? props.author.name : ''},&nbsp;
						<FormattedRelative value={props.post.date_gmt} />
					</span>
					{props.categories.length > 0 &&
						<ul className="categories">
							{props.categories.map( category => (
								<li key={category.id}><a href={category.link}>{category.name}</a></li>
							) )}
						</ul>
					}
				</div>
				<div className="actions">
					<Button onClick={props.onComment}>Reply</Button>
				</div>
			</header>
			<PostContent html={props.post.content.rendered} />
			<Reactions
				reactions={ this.state.reactions }
				onChangeReactions={ newReactions => {
					this.setState( { reactions: newReactions } )
				} }
			/>
			{props.children}

		</div>;
	}
}

Post.propTypes = {
	author:     User,
	categories: PropTypes.arrayOf( Category ).isRequired,
	children:   PropTypes.any,
	post:       PostType.isRequired,
};
