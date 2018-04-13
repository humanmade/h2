import { withSingle } from '@humanmade/repress';
import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';
import { connect } from 'react-redux';
import { Slot } from 'react-slot-fill';

import {
	Post as PostShape,
} from '../../shapes';
import { posts, users } from '../../types';

import PostComments from './Comments';
import Avatar from '../Avatar';
import Button from '../Button';
import Link from '../RelativeLink';
import AuthorLink from '../Message/AuthorLink';
import MessageContent from '../Message/Content';
import WriteComment from '../Message/WriteComment';

import './index.css';

class Post extends Component {
	constructor( props ) {
		super( props );
		this.state = { isShowingReply: false };
	}
	onClickReply() {
		this.setState( { isShowingReply: true } )
	}
	onClickCancelReply() {
		this.setState( { isShowingReply: false } )
	}
	onDidCreateComment( ...args ) {
		this.setState( { isShowingReply: false } )
	}
	render() {
		const { author, post } = this.props;
		// const categories = this.props.categories.data ? this.props.categories.data : [];
		const categories = [];
		// Scale title down slightly for longer titles.
		const headerStyle = {};
		if ( post.title.rendered.length > 22 ) {
			headerStyle.fontSize = '1.333333333rem';
		}

		const fillProps = { author, /*comments,*/ categories, post };

		return <div className="Post">
			<header>
				<Avatar
					url={author ? author.avatar_urls['96'] : ''}
					user={author}
					size={60}
				/>
				<div className="byline">
					<Link to={ post.link }>
						<h2
							dangerouslySetInnerHTML={{ __html: post.title.rendered }}
							style={ headerStyle }
						/>
					</Link>
					<span className="date">
						{ author ? (
							<AuthorLink user={ author }>{ author.name }</AuthorLink>
						) : ''},&nbsp;
						<time
							dateTime={ post.date_gmt + 'Z' }
							title={ post.date_gmt + 'Z' }
						>
							<FormattedRelative value={ post.date_gmt + 'Z' } />
						</time>
					</span>
					{categories.length > 0 &&
						<ul className="categories">
							{categories.map( category => (
								<li key={category.id}><Link to={category.link}>{category.name}</Link></li>
							) )}
						</ul>
					}
					<Slot name="Post.byline" fillChildProps={ fillProps } />
				</div>
				<div className="actions">
					<Button onClick={() => this.onClickReply()}>Reply</Button>
					<Slot name="Post.actions" fillChildProps={ fillProps } />
				</div>
			</header>
			<div className="Post-content-wrap">
				<Slot name="Post.before_content" fillChildProps={ fillProps } />
				<MessageContent html={ post.content.rendered } />
				<Slot name="Post.after_content" fillChildProps={ fillProps } />
			</div>
			<PostComments
				post={ post }
				onComment={() => this.onComment()}
				onDidCreateComment={( ...args ) => this.onDidCreateComment( ...args )}
			>
				{this.state.isShowingReply &&
					<WriteComment
						parentPost={post}
						onCancel={() => this.onClickCancelReply()}
						onDidCreateComment={( ...args ) => this.onDidCreateComment( ...args )}
					/>
				}
			</PostComments>
		</div>;
	}
}

Post.propTypes = { data: PostShape.isRequired };

const mapStateToProps = ( state, props ) => {
	if ( ! props.post ) {
		return {};
	}

	return {
		author: users.getSingle( state.users, props.post.author ),
	};
};

export default withSingle(
	posts,
	state => state.posts,
	props => props.data.id
)(
	connect( mapStateToProps )( Post )
);
