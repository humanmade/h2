import React from 'react';
import { Fill } from 'react-slot-fill';

import Reactions from './Reactions';

const ConnectReactions = props => {
	const reactionsProps = {
		postId: props.post.id,
		commentId: props.comment ? props.comment.id : null,
	};

	return <Reactions { ...reactionsProps } />;
};

export default function Plugin() {
	return (
		<React.Fragment>
			<Fill name="Post.footer_actions"><ConnectReactions /></Fill>
			<Fill name="Comment.footer_actions"><ConnectReactions /></Fill>
		</React.Fragment>
	);
}
