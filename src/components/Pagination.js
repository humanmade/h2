import React from 'react';
import { generatePath, Link } from 'react-router-dom';

import Icon from './Icon';

import './Pagination.css';

export default function Pagination( props ) {
	const { hasNext, params, path } = props;
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
		<div className="pagination util-clearfix">
			{ hasNext ? (
				<Link to={ olderPage }>
					<Icon type="arrow-left" />
					Older
				</Link>
			) : (
				/* Hack to get pagination to float correctly */
				/* eslint-disable-next-line jsx-a11y/anchor-is-valid */
				<a style={ { display: 'none' } }>&nbsp;</a>
			) }
			{ page && page > 1 ? (
				<Link to={ newerPage }>
					Newer
					<Icon type="arrow-right" />
				</Link>
			) : (
				/* Hack to get pagination to float correctly */
				/* eslint-disable-next-line jsx-a11y/anchor-is-valid */
				<a style={ { display: 'none' } }>&nbsp;</a>
			) }
		</div>
	);
}
