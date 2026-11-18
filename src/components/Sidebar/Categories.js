import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import api from '../../api';
import { decodeEntities } from '../../util';
import { parseResponse } from '../../wordpress-rest-api-cookie-auth';

const internalLink = link => link.replace( window.H2Data.site.home, '' );

const Category = ( { byParent, category } ) => {
	const children = byParent.get( category.id );

	return (
		<li>
			<Link
				className="group grid grid-cols-[auto_min-content] -ml-4 px-4 py-2 text-sm hover:bg-hm-beige/20 hover:no-underline!"
				to={ internalLink( category.link ) }
			>
				<span>
					{ decodeEntities( category.name ) }

					{ Object.prototype.hasOwnProperty.call( category, 'count' ) && (
						<span className="ml-1 opacity-60">
							({ category.count })
						</span>
					) }
				</span>
				<span className="transition-transform group-hover:translate-x-2">
					&rarr;
				</span>
			</Link>

			{ children && (
				<CategoryList
					byParent={ byParent }
					categories={ children }
				/>
			) }
		</li>
	);
};

const CategoryList = ( { byParent, categories } ) => (
	<ul className={ 'my-0 border-t border-hm-beige/50 divide-y divide-hm-beige/50 pl-4' }>
		{ categories.map( category => (
			<Category
				key={ category.id }
				byParent={ byParent }
				category={ category }
			/>
		) ) }
	</ul>
);

async function fetchCategories( signal ) {
	const byId = new Map();
	let totalPages = 1;
	for ( let page = 1; page <= totalPages; page++ ) {
		const url = `/wp/v2/categories?per_page=100&hide_empty=true&_fields=id,count,link,name,parent&page=${ page }`;
		const response = await api.fetch( url, { signal } );
		const categories = await parseResponse( response );
		totalPages = Number( response.headers.get( 'X-WP-TotalPages' ) );
		for ( const category of categories ) {
			byId.set( category.id, category );
		}
	}

	const byParent = new Map();
	for ( const category of byId.values() ) {
		// Collect every page first so a parent returned later still owns its children.
		const parent = byId.has( category.parent ) ? category.parent : 0;
		if ( ! byParent.has( parent ) ) {
			byParent.set( parent, [] );
		}
		byParent.get( parent ).push( category );
	}
	return byParent;
}

export default function Categories() {
	const [ categories, setCategories ] = useState( null );
	const [ failed, setFailed ] = useState( false );

	useEffect( () => {
		const controller = new AbortController();
		fetchCategories( controller.signal ).then(
			result => {
				if ( ! controller.signal.aborted ) {
					setCategories( result );
				}
			},
			() => {
				if ( ! controller.signal.aborted ) {
					setFailed( true );
				}
			}
		);
		return () => controller.abort();
	}, [] );

	if ( failed ) {
		return <p className="px-4 py-2 text-sm" role="status">Could not load categories.</p>;
	}
	if ( ! categories ) {
		return <p className="px-4 py-2 text-sm" role="status">Loading categories…</p>;
	}
	const roots = categories.get( 0 );
	return roots ? <CategoryList byParent={ categories } categories={ roots } /> :
		<p className="px-4 py-2 text-sm">No categories found.</p>;
}
