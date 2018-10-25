import { withSingle } from '@humanmade/repress';
import React from 'react';
import { FormattedDate } from 'react-intl';
import { compose } from 'redux';

import Header from './Header';
import MessageContent from '../Message/Content';
import RelativeLink from '../RelativeLink';
import { posts, users } from '../../types';
import { decodeEntities } from '../../util';

import './Mini.css';

function MiniComment( props ) {
	const { author, comment, parentPost } = props;

	if ( props.loadingParent || props.loadingAuthor ) {
		return (
			<div className="Comment-Mini">
				Loading…
			</div>
		);
	}

	if ( ! parentPost || ! author ) {
		return (
			<div className="Comment-Mini">
				Unable to load comment
			</div>
		);
	}

	return (
		<div className="Comment-Mini">
			<p className="Comment-Mini__context">
				<RelativeLink
					to={ `${ parentPost.link }#comment-${ comment.id }` }
				>
					<span className="Comment-Mini__context-post">
						{ decodeEntities( parentPost.title.rendered ) }
					</span>
					{ ' ' }&mdash;{ ' ' }
					<time
						dateTime={ comment.date_gmt + 'Z' }
						title={ comment.date_gmt + 'Z' }
					>
						<FormattedDate
							day="numeric"
							month="short"
							value={ comment.date_gmt + 'Z' }
						/>
					</time>
				</RelativeLink>
			</p>
			<div className="Comment-Mini__comment">
				<Header
					author={ author }
					comment={ comment }
					mini
					post={ parentPost }
				/>
				<MessageContent
					html={ comment.content.rendered }
				/>
			</div>
		</div>
	);
}

export default compose(
	withSingle(
		posts,
		state => state.posts,
		props => props.comment.post,
		{
			mapDataToProps: data => ( {
				parentPost: data.post,
				loadingParent: data.loading,
			} ),
		}
	),
	withSingle(
		users,
		state => state.users,
		props => props.comment.author,
		{
			mapDataToProps: data => ( {
				author: data.post,
				loadingAuthor: data.loading,
			} ),
		}
	)
)( MiniComment );
