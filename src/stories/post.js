import React from 'react';
import { storiesOf, action } from '@storybook/react';

import { comment, post, user } from './stubs';
import Post from '../components/Post';
import WritePost from '../components/Post/Write';

storiesOf( 'Post', module )
	.add( 'Post', () => <Post author={ user } post={ post } /> )
	.add( 'Post Titles', () => {
		const lengths = [ 20, 22, 24, 26, 28, 30, 32, 34 ];
		return (
			<div style={ { width: '800px' } }>
				{ lengths.map( length => (
					<Post
						author={ user }
						categories={ [] }
						post={ {
							...post,
							title: { rendered: 'm'.repeat( length ) },
							content: { rendered: `Post with title of length ${ length }` },
						} }
					/>
				) ) }
			</div>
		);
	} )
	.add( 'WritePost', () => (
		<WritePost
			author={ user }
			post={ post }
			onChange={ () => {} }
			onSave={ () => {} }
			onCancel={ () => {} }
		/>
	) );
