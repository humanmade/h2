import React from 'react';
import { generatePath, Link } from 'react-router-dom';

import NavigationButton from './Sidebar/NavigationButton';

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
	const processedParams = {};
	Object.keys( params ).forEach( key => {
		if ( typeof params[ key ] === 'string' && params[ key ].indexOf( '/' ) > -1 ) {
			processedParams[ key ] = params[ key ].split( '/' );
		} else {
			processedParams[ key ] = params[ key ];
		}
	} );

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

	if ( ! hasNext && page <= 1 ) {
		return null;
	}

	return (
		<nav className="flex items-center justify-between gap-4 pt-4 pb-10 -mx-2" aria-label="Post pages">
			<div>
				{ hasNext && (
					<NavigationButton as={ Link } iconOnly={ false } to={ olderPage }>
						Older
					</NavigationButton>
				) }
			</div>
			{ page > 1 && (
				<NavigationButton as={ Link } direction="right" iconOnly={ false } to={ newerPage }>
					Newer
				</NavigationButton>
			) }
		</nav>
	);
}
