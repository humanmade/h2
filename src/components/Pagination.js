import React from 'react';
import { generatePath, Link } from 'react-router-dom';

export default function Pagination( props ) {
	let { path } = props;
	const { hasNext, params } = props;
	const page = Number( params.page || 1 );

	if ( path.charAt( path.length - 1 ) === '+' ) {
		// Paths ending in + match any number of nested sections, but do not
		// have any pagination parameters in our app. Add route params.
		path = `${ path }/:hasPage(page)/:page(\\d+)?`;
	}

	// Handle slashes in URL pieces. Without this nested/categories would
	// become nested%2Fcategories, and 404.
	const processedParams = Object.keys( params ).reduce(
		( memo, key ) => {
			const val = params[ key ];
			if ( val && val.indexOf( '/' ) > -1 ) {
				memo[ key ] = val.split( '/' );
			} else {
				memo[ key ] = val;
			}
			return memo;
		},
		{}
	);

	const olderPage = generatePath(
		path,
		{
			...processedParams,
			hasPage: 'page',
			page: page + 1,
		}
	);
	const newerPage = generatePath(
		path,
		{
			...processedParams,
			hasPage: 'page',
			page: page - 1,
		}
	);

	return (
		<div className="pagination">
			{ hasNext ? (
				<Link to={ olderPage }>Older</Link>
			) : (
				/* Hack to get pagination to float correctly */
				/* eslint-disable-next-line jsx-a11y/anchor-is-valid */
				<a style={ { display: 'none' } }>&nbsp;</a>
			) }
			{ page && page > 1 ? (
				<Link to={ newerPage }>Newer</Link>
			) : (
				/* Hack to get pagination to float correctly */
				/* eslint-disable-next-line jsx-a11y/anchor-is-valid */
				<a style={ { display: 'none' } }>&nbsp;</a>
			) }
		</div>
	);
}
