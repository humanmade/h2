import PropTypes from 'prop-types';
import React from 'react';

import LinkButton from '../LinkButton';
import Notification from '../Notification';

import Result from './Result';
import { formatTotal } from './util';

function Pagination( props ) {
	const { page, totalPages, onChangePage } = props;
	if ( totalPages <= 1 ) {
		return null;
	}

	return (
		<nav
			aria-label="Search results pages"
			className="flex items-center justify-between mt-4 pt-4 border-t border-solid border-hm-beige text-sm"
		>
			<div>
				{ page > 1 && (
					<LinkButton
						className="group flex items-center"
						onClick={ () => onChangePage( page - 1 ) }
					>
						<span className="icon icon--arrow-right icon--blue w-4! mr-2 rotate-180 transition-transform group-hover:-translate-x-2">&larr;</span>
						<span>Previous</span>
					</LinkButton>
				) }
			</div>
			<span className="text-black/60">Page { page } of { totalPages }</span>
			<div>
				{ page < totalPages && (
					<LinkButton
						className="group flex items-center"
						onClick={ () => onChangePage( page + 1 ) }
					>
						<span>Next</span>
						<span className="icon icon--arrow-right icon--blue w-4! ml-2 transition-transform group-hover:translate-x-2">&rarr;</span>
					</LinkButton>
				) }
			</div>
		</nav>
	);
}

/**
 * List of network search results.
 *
 * @param {object} props Results, request state, and paging callbacks.
 * @returns {React.ReactNode} Results section.
 */
export default function Results( props ) {
	const { error, loading, page, results, term, total, totalPages } = props;

	let heading;
	if ( error ) {
		heading = `Search for “${ term }”`;
	} else if ( loading && ! results ) {
		heading = `Searching for “${ term }”…`;
	} else {
		heading = `${ formatTotal( total ) } for “${ term }”`;
	}

	return (
		<section
			aria-busy={ loading }
			aria-labelledby="Super-results-title"
			className="Super-results min-w-0"
		>
			<header
				aria-live="polite"
				className="flex items-baseline justify-between gap-4 mb-3 pb-3 border-b border-solid border-hm-beige"
			>
				<h3
					className="m-0 text-base font-bold"
					id="Super-results-title"
				>
					{ heading }
				</h3>
				{ loading && results && (
					<span className="text-xs text-black/50">Updating…</span>
				) }
			</header>

			{ error ? (
				<Notification type="error">
					{ error.message || 'The search request failed.' }
				</Notification>
			) : results && ! results.length ? (
				<p className="text-black/60">
					Nothing matched “{ term }”. Try different words, or widen the filters.
				</p>
			) : results ? (
				<ol
					className={ [
						'list-none m-0 p-0 divide-y divide-solid divide-hm-beige',
						'transition-opacity duration-150',
						loading ? 'opacity-50' : '',
					].filter( Boolean ).join( ' ' ) }
				>
					{ results.map( result => (
						<Result
							key={ `${ result.type }-${ result.site.id }-${ result.id }` }
							result={ result }
						/>
					) ) }
				</ol>
			) : null }

			{ ! error && (
				<Pagination
					page={ page }
					totalPages={ totalPages }
					onChangePage={ props.onChangePage }
				/>
			) }
		</section>
	);
}

Results.propTypes = {
	error: PropTypes.object,
	loading: PropTypes.bool.isRequired,
	page: PropTypes.number.isRequired,
	results: PropTypes.array,
	term: PropTypes.string.isRequired,
	total: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	onChangePage: PropTypes.func.isRequired,
};
