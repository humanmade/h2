import React from 'react';
import Pagination from './Pagination';

import { withCentering } from '../stories/decorators';

export default {
	title: 'Components|Pagination',
	decorators: [
		withCentering( {
			minWidth: '30vw',
		} ),
	],
}

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
