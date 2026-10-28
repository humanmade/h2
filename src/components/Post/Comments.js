import { withArchive } from '@humanmade/repress';
import React, { Fragment } from 'react';

import { comments } from '../../types';
import CommentLoader from '../Comment/Loader';
import CommentsList from '../CommentsList';
import WriteComment from '../Message/WriteComment';

class PostComments extends React.Component {
	componentDidUpdate() {
		this.ensureAllLoaded();
	}

	ensureAllLoaded() {
		if ( this.props.loading || this.props.loadingMore || ! this.props.posts || ! this.props.hasMore ) {
			return;
		}

		this.props.onLoadMore( null );
	}

	render() {
		const props = this.props;
		if ( props.loading || props.loadingMore ) {
			return (
				<Fragment>
					<CommentLoader />
				</Fragment>
			);
		}

		if ( ! props.posts ) {
			return null;
		}

		const topLevel = props.posts.filter( comment => comment.parent === 0 );
		const onDidCreateComment = () => {
			// Reload comments.
			props.onLoad();

			// And pass up.
			props.onDidCreateComment();
		};

		return (
			<CommentsList
				allComments={ props.posts }
				comments={ topLevel }
				post={ props.post }
				onDidCreateComment={ onDidCreateComment }
			>
				{ props.showingReply && (
					<WriteComment
						parentPost={ props.post }
						onCancel={ props.onCancelReply }
						onDidCreateComment={ onDidCreateComment }
					/>
				) }
			</CommentsList>
		);
	}
}

export default withArchive(
	comments,
	state => state.comments,
	props => {
		const { post } = props;

		// Distinct archive id + opt-in flag so only this stream view is widened
		// to include bot-authored activity markers. Post/Summary shares this same
		// `stream:${post.id}` archive (so the count stays consistent after a
		// reply) but filters markers out of its count client-side. The
		// recent-comments sidebar uses a separate author-scoped query and never
		// opts in, so it stays markers-free.
		const archiveId = `stream:${ post.id }`;
		comments.registerArchive( archiveId, {
			post: post.id,
			per_page: 100,
			slack_markers: 1,
		} );
		return archiveId;
	}
)( PostComments );
