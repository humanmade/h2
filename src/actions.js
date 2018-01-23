import { parseResponse } from './wordpress-rest-api-cookie-auth';

import api from './api';
import store from './store';

const fetchCategories = store.actions.categories.fetch;
const fetchReplies = store.actions.comments.fetch;
const fetchReactions = store.actions.reactions.fetch;
const createReaction = store.actions.reactions.create;
const deleteReaction = store.actions.reactions.delete;
const fetchCurrentUser = store.actions.user.fetch;
const fetchUsers = store.actions.users.fetch;

export {
	fetchCategories,
	fetchReplies,
	fetchUsers,
	fetchReactions,
	createReaction,
	deleteReaction,
	fetchCurrentUser,
};

export function uploadMedia( file ) {
	return ( dispatch, getStore ) => {
		const options = { method: 'POST' };

		/**
		 * WordPress <4.9 doesn't allow Content-Disposition across CORS, so
		 * pack the data into FormData.
		 *
		 * https://core.trac.wordpress.org/ticket/41696
		 */
		options.body = new FormData();
		options.body.append( 'file', file );

		dispatch( {
			type:    'WP_API_REDUX_CREATE_MEDIA_UPDATING',
			payload: {},
		} );
		return api.fetch( '/wp/v2/media', options )
			.then( parseResponse )
			.then( object => {
				dispatch( {
					type:    'WP_API_REDUX_FETCH_MEDIA_UPDATED',
					payload: {
						objectName: 'media',
						objects:    [ object ],
					},
				} );
				dispatch( {
					type:    'WP_API_REDUX_CREATE_MEDIA_UPDATED',
					payload: {
						objectName: 'media',
						object,
					},
				} );
				return object;
			} );
	};
}
