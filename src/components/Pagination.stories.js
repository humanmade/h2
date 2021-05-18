import React from 'react';

import { withCentering } from '../stories/decorators';

import Pagination from './Pagination';

export default {
	title: 'Components|Pagination',
	decorators: [
		withCentering( {
			minWidth: '30vw',
		} ),
	],
};

const commonProps = {
	hasNext: true,
	params: {
		page: 1,
	},
	path: '/',
};

export const Older = () => (
	<Pagination
		{ ...commonProps }
	/>
);
export const Newer = () => (
	<Pagination
		{ ...commonProps }
		hasNext={ false }
		params={ { page: 2 } }
	/>
);
export const Both = () => (
	<Pagination
		{ ...commonProps }
		params={ { page: 2 } }
	/>
);
export const Neither = () => (
	<Pagination
		{ ...commonProps }
		hasNext={ false }
	/>
);
