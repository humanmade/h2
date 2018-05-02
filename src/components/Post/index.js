import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';
import { Slot } from 'react-slot-fill';

import { withApiData } from '../../with-api-data';
import {
	Post as PostShape,
} from '../../shapes';

import Avatar from '../Avatar';
import Button from '../Button';
import Editor from '../Editor';
import CommentsList from '../../components/CommentsList';
import Link from '../RelativeLink';
import AuthorLink from '../Message/AuthorLink';
import MessageContent from '../Message/Content';
import WriteComment from '../Message/WriteComment';

import './index.css';

class Post extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			isShowingReply: false,
			isEditing: false,
			isSubmitting: false,
		};
	}
	onClickReply() {
		this.setState( { isShowingReply: true } )
	}
	onClickCancelReply() {
		this.setState( { isShowingReply: false } )
	}
	onDidCreateComment( ...args ) {
		this.setState( { isShowingReply: false } )
		this.props.refreshData();
	}
	onSubmitEditing( content, unprocessedContent ) {
		this.setState( { isSubmitting: true } );

		const body = {
			content,
			status: 'publish',
			meta: { unprocessed_content: unprocessedContent },
		};

		this.props.fetch( `/wp/v2/posts/${ this.props.data.id }`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( body ),
			method: 'POST',
		} ).then( r => r.json().then( data => {
			if ( ! r.ok ) {
				this.setState( {
					isSubmitting: false,
					error: data,
				} );
				return;
			}

			this.setState( {
				isSubmitting: false,
				isEditing: false,
			} );
			this.props.onInvalidate();
		} ) );
	}
	render() {
		const post = this.props.data;
		const author = this.props.author.data;
		const comments = this.props.comments.data ? this.props.comments.data.filter( comment => comment.parent === 0 ) : [];
		const categories = this.props.categories.data ? this.props.categories.data : [];
		// Scale title down slightly for longer titles.
		const headerStyle = {};
		if ( post.title.rendered.length > 22 ) {
			headerStyle.fontSize = '1.333333333rem';
		}

		const fillProps = {
			author,
			comments,
			categories,
			post,
		};

		return <div className="Post">
			<header>
				<Avatar
					url={ author ? author.avatar_urls['96'] : '' }
					user={ author }
					size={ 60 }
				/>
				<div className="byline">
					<Link to={ post.link }>
						<h2
							dangerouslySetInnerHTML={ { __html: post.title.rendered } }
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
							{ categories.map( category => (
								<li key={ category.id }>
									<Link to={ category.link }>{ category.name }</Link>
								</li>
							) ) }
						</ul>
					}
					<Slot name="Post.byline" fillChildProps={ fillProps } />
				</div>
				<div className="actions">
					{! this.state.isEditing &&
						<Button onClick={ () => this.setState( { isEditing: true } ) }>Edit</Button>
					}
					<Button onClick={ () => this.onClickReply() }>Reply</Button>
					<Slot name="Post.actions" fillChildProps={ fillProps } />
				</div>
			</header>
			<div className="Post-content-wrap">
				<Slot name="Post.before_content" fillChildProps={ fillProps } />
				{ this.state.isEditing ? (
					<Editor
						initialValue={ post.meta.unprocessed_content || post.content.raw }
						submitText={ this.state.isSubmitting ? 'Updating…' : 'Update' }
						onCancel={ () => this.setState( { isEditing: false } ) }
						onSubmit={ ( ...args ) => this.onSubmitEditing( ...args ) }
					/>
				) : (
					<MessageContent html={ post.content.rendered } />
				) }
				<Slot name="Post.after_content" fillChildProps={ fillProps } />
			</div>
			<CommentsList
				allComments={ this.props.comments.data ? this.props.comments.data : [] }
				comments={ comments }
				post={ post }
				onComment={ () => this.onComment() }
				onDidCreateComment={ ( ...args ) => this.onDidCreateComment( ...args ) }
			>
				{ this.state.isShowingReply && (
					<WriteComment
						parentPost={ post }
						onCancel={ () => this.onClickCancelReply() }
						onDidCreateComment={ ( ...args ) => this.onDidCreateComment( ...args ) }
					/>
				) }
			</CommentsList>
		</div>;
	}
}

Post.propTypes = {
	data: PostShape.isRequired,
};

const mapPropsToData = props => ( {
	comments: `/wp/v2/comments?post=${ props.data.id }&per_page=100`,
	author: `/wp/v2/users/${ props.data.author }`,
	categories: `/wp/v2/categories?include=${ props.data.categories.join( ',' ) }`,
} );

export default withApiData( mapPropsToData )( Post );
