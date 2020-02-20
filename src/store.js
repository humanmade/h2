import {
	applyMiddleware,
	createStore as createReduxStore,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';

import reducers from './reducers';

export const createStore = preload => {
	const currentUser = preload['/wp/v2/users/me'] ? preload['/wp/v2/users/me'] : null;
	const users = [
		...preload['/wp/v2/users?per_page=100'],
		...( currentUser ? [ currentUser ] : [] ),
	];

	const initialState = {
		users: {
			archives: {
				all: users.map( user => user.id ),
				me: currentUser ? [ currentUser.id ] : [],
			},
			current: currentUser ? currentUser.id : null,
			posts: users,
		},
	};

	return createReduxStore(
		reducers,
		initialState,
		composeWithDevTools( applyMiddleware( thunk ) )
	);
}
