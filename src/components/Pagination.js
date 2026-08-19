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

	return (
		<div className="grid grid-cols-2">
			{ hasNext && (
				<div>
					<Link
						className="group"
						to={ olderPage }
					>
						<span className="icon icon--arrow-right icon--blue h-6 w-6 mr-2 rotate-180 transition-transform group-hover:-translate-x-2">&larr;</span>
						Older
					</Link>
				</div>
			) }
			{ page && page > 1 && (
				<div className="justify-self-end col-start-2">
					<Link
						className="group"
						to={ newerPage }
					>
						Newer
						<span className="icon icon--arrow-right icon--blue h-6 w-6 ml-2 transition-transform group-hover:translate-x-2">&larr;</span>
					</Link>
				</div>
			) }
		</div>
	);
}
