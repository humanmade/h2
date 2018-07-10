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
			<Fill name="Post.after_content"><ConnectReactions /></Fill>
			<Fill name="Comment.after_content"><ConnectReactions /></Fill>
		</React.Fragment>
	);
}
