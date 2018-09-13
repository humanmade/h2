import React from 'react';
import { generatePath, Link } from 'react-router-dom';

export default function Pagination( props ) {
	const { params, path } = props;
	const page = Number( params.page || 1 );
	const olderPage = generatePath(
		path,
		{
			...params,
			hasPage: 'page',
			page: page + 1,
		}
	);
	const newerPage = generatePath(
		path,
		{
			...params,
			hasPage: 'page',
			page: page - 1,
		}
	);

	return (
		<div className="pagination">
			<Link to={ olderPage }>Older</Link>
			{ page > 1 ? (
				<Link to={ newerPage }>Newer</Link>
			) : (
				/* Hack to get pagination to float correctly */
				/* eslint-disable-next-line jsx-a11y/anchor-is-valid */
				<a style={ { display: 'none' } }>&nbsp;</a>
			) }
		</div>
	);
}
