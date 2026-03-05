import { withSingle } from '@humanmade/repress';
import React from 'react';
import { FormattedDate } from 'react-intl';
import { compose } from 'redux';

import { withUser } from '../../hocs';
import { posts } from '../../types';
import { decodeEntities } from '../../util';
import Link from '../Link';
import MessageContent from '../Message/Content';

import Header from './Header';

const CARD_CLASSES = [
	// Back-compat:
	'Comment-Mini',

	'border border-solid border-hm-beige p-[0.5em]',
	'shadow-[0_0_4px_var(--hm-light-grey)] rounded',
].join( ' ' );

function MiniComment( props ) {
	const { comment, parentPost, user } = props;

	if ( props.loadingParent || props.loadingUser ) {
		return (
			<div className={ CARD_CLASSES }>
				Loading…
			</div>
		);
	}

	if ( ! parentPost || ! user ) {
		return (
			<div className={ CARD_CLASSES }>
				Unable to load comment
			</div>
		);
	}

	return (
		<div className={ CARD_CLASSES }>
			<p className="m-0 text-[0.9em] text-hm-medium-grey [&_a]:text-inherit">
				<Link
					href={ comment.link }
				>
					<span className="font-bold">
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
			<div className="ml-[30px]">
				<Header
					author={ user }
					comment={ comment }
					mini
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
