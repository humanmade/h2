import { withSingle } from '@humanmade/repress';
import React from 'react';

import { withCategories, withUser } from '../../hocs';
import { pages, posts } from '../../types';
import CommentHeader from '../Comment/Header';
import CommentLoader from '../Comment/Loader';
import Link from '../Link';
import MessageContent from '../Message/Content';
import { MessageHeader } from '../Message/Header';
import { PostHeaderLoader } from '../Post/Loader';

const ROW_CLASSES = 'py-6 m-0 border-b border-hm-beige';

// Duplicates the look of the Reply button on posts. The `!` overrides are needed
// to beat the defaults from Link and the global `.App a` rules.
const VIEW_POST_CLASSES = [
	'Post__actions',
	'inline-flex items-center justify-center gap-1.5 min-w-24 min-h-8 px-3 py-1',
	'font-medium text-sm leading-5 text-[#41454d]! whitespace-nowrap',
	'bg-white border! border-solid! border-[#dfe1e5]! rounded-md',
	'transition-colors duration-150 ease-out',
	'hover:bg-[#f5f6f8] hover:border-[#c8ccd3]! active:bg-[#eceef2]',
	'hover:no-underline! focus:no-underline!',
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hm-vibrant-blue',
].join( ' ' );

function ViewPostButton( { post } ) {
	return (
		<Link
			className={ VIEW_POST_CLASSES }
			disablePreviews
			href={ post.link }
		>
			<span>{ post.type === 'page' ? 'View page' : 'View post' }</span><span aria-hidden="true">→</span>
		</Link>
	);
}

function BasePostHeader( { categories, parentPost, user } ) {
	// Pages don't have categories.
	const postCategories = categories.data && parentPost.categories ? (
		categories.data.filter( category => parentPost.categories.indexOf( category.id ) >= 0 )
	) : [];

	return (
		<MessageHeader
			author={ user }
			categories={ postCategories }
			post={ parentPost }
			sticky={ false }
		>
			<ViewPostButton post={ parentPost } />
		</MessageHeader>
	);
}

// withCategories overwrites any `post` prop with its own function, so the post
// needs to be passed through under a different name.
const PostHeader = withCategories( withUser( props => props.parentPost.author )( BasePostHeader ) );

function LoadingPostHeader() {
	return (
		<div role="status" aria-label="Loading post">
			<div className="motion-safe:animate-pulse" aria-hidden="true">
				<PostHeaderLoader />
			</div>
		</div>
	);
}

export function UserCommentLoader() {
	return (
		<div className={ ROW_CLASSES }>
			<LoadingPostHeader />
			<CommentLoader />
		</div>
	);
}

function UserComment( props ) {
	const { comment, loadingParent, parentPost, user } = props;

	return (
		<div className={ ROW_CLASSES }>
			{ parentPost ? (
				<PostHeader parentPost={ parentPost } />
			) : loadingParent && (
				<LoadingPostHeader />
			) }

			{ /* Uses the thread classes to lay out like a comment under a post. */ }
			<div className="CommentsList">
				<div className="Comment relative">
					<CommentHeader
						author={ user }
						comment={ comment }
					/>
					<div className="pb-4">
						<MessageContent html={ comment.content.rendered } />
					</div>
				</div>
			</div>

			{ /* The post header hides its actions on small screens. */ }
			{ parentPost && (
				<div className="min-[601px]:hidden">
					<ViewPostButton post={ parentPost } />
				</div>
			) }
		</div>
	);
}

const withParent = ( handler, getState ) => withSingle(
	handler,
	getState,
	props => props.comment.post,
	{
		mapDataToProps: data => ( {
			parentPost: data.post,
			loadingParent: data.loading,
		} ),
	}
);

const CommentOnPost = withParent( posts, state => state.posts )( UserComment );
const CommentOnPage = withParent( pages, state => state.pages )( UserComment );

export default function ConnectedUserComment( props ) {
	const { up } = props.comment._links;
	const Component = up && up[0].post_type === 'page' ? CommentOnPage : CommentOnPost;

	return <Component { ...props } />;
}
