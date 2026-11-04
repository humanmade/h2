import { withPagedArchive } from '@humanmade/repress';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { NavLink as Link } from 'react-router-dom';

import { pages } from '../../types';
import { decodeEntities } from '../../util';

import Chevron from './Chevron';

const internalLink = link => link.replace( window.H2Data.site.home, '' );

const Page = ( { all, page } ) => {
	const childPages = all.filter( p => p.parent === page.id );

	return (
		<li>
			<Link
				exact
				activeClassName="is-active"
				className="Sidebar-link"
				to={ internalLink( page.link ) }
			>
				<span>{ decodeEntities( page.title.rendered ) }</span>
				<Chevron />
			</Link>

			{ childPages.length > 0 && (
				<PageList
					all={ all }
					pages={ childPages }
				/>
			) }
		</li>
	);
};

const PageList = ( { all, pages: pageItems } ) => (
	<ul className="Sidebar-navigation Sidebar-navigation-tree">
		{ pageItems.map( page => (
			<Page
				key={ page.id }
				all={ all }
				page={ page }
			/>
		) ) }
	</ul>
);

/**
 * Receives per-page props from withPagedArchive. Automatically advances to the
 * next page when a page finishes loading, until hasMore is false.
 *
 * @param {object} props Props passed down from withPagedArchive.
 * @returns {React.ReactNode} Loading indicator, or the full page list.
 */
function PagesLoader( props ) {
	const { loading, loadingMore, hasMore, posts, onNextPage } = props;

	// Advance to the next page once the current page has finished loading.
	useEffect( () => {
		if ( ! loading && ! loadingMore && posts && hasMore ) {
			onNextPage();
		}
	}, [ loading, loadingMore, posts, hasMore, onNextPage ] );

	if ( loading || loadingMore || hasMore ) {
		return <p className="px-4 py-2 text-sm">Loading…</p>;
	}

	const topLevel = ( props.all || [] ).filter( p => p.parent === 0 );
	if ( topLevel.length === 0 ) {
		return <p className="px-4 py-2 text-sm">No pages found.</p>;
	}
	return (
		<PageList
			all={ props.all || [] }
			pages={ topLevel }
		/>
	);
}

const ConnectedPagesLoader = connect(
	state => ( { all: pages.getArchive( state.pages, 'all' ) } )
)( PagesLoader );

const mapPropsToArchive = () => {
	pages.registerArchive( 'all', {
		per_page: 100,
		order: 'asc',
		orderby: 'menu_order',
		_fields: 'id,link,parent,title',
	} );
	return 'all';
};

const ConnectedLoader = withPagedArchive( pages, state => state.pages, mapPropsToArchive )( ConnectedPagesLoader );

export default function Pages() {
	const [ page, setPage ] = useState( 1 );

	return (
		<div className="Sidebar-inline-content">
			<ConnectedLoader
				page={ page }
				onNextPage={ () => setPage( p => p + 1 ) }
			/>
		</div>
	);
}
