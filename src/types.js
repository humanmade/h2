import { handler } from '@humanmade/repress';

export const posts = new handler( {
	type: 'posts',
	url:  `${ window.wpApiSettings.root }wp/v2/posts`,
	nonce: window.wpApiSettings.nonce,
} );

export const comments = new handler( {
	type:  'comments',
	url:   `${ window.wpApiSettings.root }wp/v2/comments`,
	nonce: window.wpApiSettings.nonce,
} );

export const reactions = new handler( {
	type:  'reactions',
	url:   `${ window.wpApiSettings.root }h2/v1/reactions`,
	nonce: window.wpApiSettings.nonce,
} );

export const users = new handler( {
	type:  'users',
	url:   `${ window.wpApiSettings.root }wp/v2/users`,
	nonce: window.wpApiSettings.nonce,
} );
users.registerArchive( 'me', state => ( { include: state.users.current } ) );
users.registerArchive( 'all', { per_page: 100 } );
