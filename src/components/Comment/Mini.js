import { withSingle } from '@humanmade/repress';
import React from 'react';
import { FormattedDate } from 'react-intl';
import { compose } from 'redux';

import Header from './Header';
import Link from '../Link';
import MessageContent from '../Message/Content';
import { withUser } from '../../hocs';
import { posts } from '../../types';
import { decodeEntities } from '../../util';

import './Mini.css';

function MiniComment( props ) {
	const { comment, parentPost, user } = props;

	if ( props.loadingParent || props.loadingUser ) {
		return (
			<div className="Comment-Mini">
				Loading…
			</div>
		);
	}

	if ( ! parentPost || ! user ) {
		return (
			<div className="Comment-Mini">
				Unable to load comment
			</div>
		);
	}

	return (
		<div className="Comment-Mini">
			<p className="Comment-Mini__context">
				<Link
					href={ `${ parentPost.link }#comment-${ comment.id }` }
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
				</Link>
			</p>
			<div className="Comment-Mini__comment">
				<Header
					author={ user }
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
	withUser( props => props.comment.author )
)( MiniComment );
