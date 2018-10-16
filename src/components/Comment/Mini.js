import React from 'react';
import { FormattedDate } from 'react-intl';

import Header from './Header';
import MessageContent from '../Message/Content';
import { withApiData } from '../../with-api-data';
import RelativeLink from '../RelativeLink';
import { decodeEntities } from '../../util';

import './Mini.css';

function MiniComment( props ) {
	const { author, comment, parentPost } = props;

	if ( parentPost.isLoading || author.isLoading ) {
		return (
			<div className="Comment-Mini">
				Loading…
			</div>
		);
	}

	if ( ! parentPost.data || ! author.data ) {
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
					to={ `${ parentPost.data.link }#comment-${ comment.id }` }
				>
					<span className="Comment-Mini__context-post">
						{ decodeEntities( parentPost.data.title.rendered ) }
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
					author={ author.data }
					comment={ comment }
					mini
					post={ parentPost.data }
				/>
				<MessageContent
					html={ comment.content.rendered }
				/>
			</div>
		</div>
	);
}

const mapPropsToData = props => ( {
	author: `/wp/v2/users/${ props.comment.author }`,
	parentPost: `/wp/v2/posts/${ props.comment.post }`,
} );

export default withApiData( mapPropsToData )( MiniComment );
