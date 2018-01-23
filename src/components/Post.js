import React, { Component } from 'react';

import { FormattedRelative } from 'react-intl';
import { withApiData } from '../with-api-data';
import {
	Post as PostShape,
} from '../shapes';

import AuthorName from './AuthorName';
import Avatar from './Avatar';
import Button from './Button';
import CommentsList from '../components/CommentsList';
import Link from './RelativeLink';
import PostContent from './PostContent'
import Reactions from '../containers/Reactions'
import WriteComment from './WriteComment';

import './Post.css';

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
	onWroteComment(...args) {
		this.setState( { isShowingReply: false } )
		this.props.refreshData();
	}
	render() {
		const post = this.props.post;
		const author = this.props.author.data;
		let comments = this.props.comments.data ? this.props.comments.data.filter( comment => comment.parent === 0 ) : [];
		const categories = this.props.categories.data ? this.props.categories.data : [];
		// Scale title down slightly for longer titles.
		const headerStyle = {};
		if ( this.props.post.title.rendered.length > 22 ) {
			headerStyle.fontSize = '1.333333333rem';
		}

		return <div className="Post">
			<header>
				<Avatar
					url={author ? author.avatar_urls['96'] : ''}
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
						{author ? <AuthorName user={ author } /> : ''},&nbsp;
						<FormattedRelative value={post.date_gmt} />
					</span>
					{categories.length > 0 &&
						<ul className="categories">
							{categories.map( category => (
								<li key={category.id}><Link to={category.link}>{category.name}</Link></li>
							) )}
						</ul>
					}
				</div>
				<div className="actions">
					<Button onClick={() => this.onClickReply()}>Reply</Button>
				</div>
			</header>
			<PostContent html={post.content.rendered} />
			<Reactions postId={post.id }/>
			<CommentsList
				allComments={this.props.comments.data ? this.props.comments.data : []}
				comments={comments}
				onComment={() => this.onComment()}
				post={this.props.post}
				onWroteComment={(...args) => this.onWroteComment(...args)}
			>
				{this.state.isShowingReply &&
					<WriteComment
						post={post}
						onCancel={() => this.onClickCancelReply()}
						onWroteComment={(...args) => this.onWroteComment(...args)}
					/>
				}
			</CommentsList>
		</div>;
	}
}

Post.propTypes = {
	post: PostShape.isRequired,
};

const mapPropsToData = props => ( {
	comments:   `/wp/v2/comments?post=${ props.post.id }&per_page=100`,
	author:     `/wp/v2/users/${ props.post.author }`,
	categories: `/wp/v2/categories?include=${ props.post.categories.join( ',' ) }`,
} );

export default withApiData( mapPropsToData )( Post );
