import PropTypes from 'prop-types';
import React from 'react';

import { withSites } from '../../hocs';
import Notification from '../Notification';

import { displayUrl, isCurrentSite } from './util';

const CARD_CLASSES = [
	'group block h-full p-5 rounded-sm',
	'border border-solid border-hm-beige bg-hm-beige/20',
	'text-black! no-underline!',
	'transition-colors duration-150',
	'hover:bg-hm-beige/50 hover:border-hm-warm-grey/40',
	'focus:bg-hm-beige/50 focus:border-hm-vibrant-blue focus:outline-hidden',
].join( ' ' );

export function SiteCard( props ) {
	const { current, site } = props;

	return (
		<li className="m-0 p-0">
			<a
				aria-current={ current ? 'page' : undefined }
				className={ CARD_CLASSES }
				href={ site.url }
			>
				<div className="flex items-baseline justify-between gap-3">
					<h3 className="m-0 text-lg font-bold leading-tight">
						{ site.name }
					</h3>
					{ current && (
						<span className="shrink-0 text-xs uppercase tracking-wide font-semibold text-hm-vibrant-blue">
							Current
						</span>
					) }
				</div>
				<p className="m-0 mt-2 text-sm text-black/60">
					{ site.description || <em>No description yet.</em> }
				</p>
				<p className="m-0 mt-3 text-xs text-black/40 truncate">
					{ displayUrl( site.url ) }
				</p>
			</a>
		</li>
	);
}

SiteCard.propTypes = {
	current: PropTypes.bool,
	site: PropTypes.shape( {
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		description: PropTypes.string,
		url: PropTypes.string.isRequired,
	} ).isRequired,
};

/**
 * Grid of every site the user can switch to.
 *
 * @param {object} props Props, with `sites` from the site switcher API.
 * @returns {React.ReactNode} Site grid, or a loading/error state.
 */
export function SiteSwitcher( props ) {
	const { sites } = props;

	if ( sites.isLoading ) {
		return <p className="text-black/60">Loading sites…</p>;
	}

	if ( sites.error ) {
		return (
			<Notification type="error">
				Could not load sites: { sites.error.message }
			</Notification>
		);
	}

	const list = sites.data || [];
	if ( ! list.length ) {
		return (
			<Notification type="status">
				No sites have been added to the site switcher yet.
			</Notification>
		);
	}

	return (
		<section aria-labelledby="Super-sites-title">
			<h3
				className="m-0 mb-3 text-sm uppercase tracking-wide text-hm-warm-grey"
				id="Super-sites-title"
			>
				{ list.length === 1 ? '1 site' : `${ list.length } sites` }
			</h3>
			<ul className="list-none m-0 p-0 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{ list.map( site => (
					<SiteCard
						key={ site.id }
						current={ isCurrentSite( site ) }
						site={ site }
					/>
				) ) }
			</ul>
		</section>
	);
}

SiteSwitcher.propTypes = {
	sites: PropTypes.shape( {
		data: PropTypes.array,
		error: PropTypes.object,
		isLoading: PropTypes.bool,
	} ).isRequired,
};

export default withSites( SiteSwitcher );
