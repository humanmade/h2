import React from 'react';
import { storiesOf, action } from '@storybook/react';

import { comment, post, user } from './stubs';
import { Post } from '../components/Post';
import WritePost from '../components/Post/Write';

const apiResponse = ( data, loading = false ) => {
	return {
		isLoading: loading,
		data,
	};
};

const defaultProps = {
	author: apiResponse( user ),
	comments: apiResponse( [] ),
	categories: apiResponse( [] ),
	data: post,

	invalidateDataForUrl: action( 'invalidateDataForUrl' ),
	refreshData: action( 'refreshData' ),
	onInvalidate: action( 'onInvalidate' ),
	onLoadEditable: action( 'onLoadEditable' ),
};

storiesOf( 'Post', module )
	.add( 'Post', () => (
		<Post
			{ ...defaultProps }
		/>
	) )
	.add( 'Post Titles', () => {
		const lengths = [ 20, 22, 24, 26, 28, 30, 32, 34 ];
		return (
			<div style={ { width: '800px' } }>
				{ lengths.map( length => (
					<Post
						{ ...defaultProps }
						data={ {
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
