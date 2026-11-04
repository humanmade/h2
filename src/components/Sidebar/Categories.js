import React from 'react';
import { NavLink as Link } from 'react-router-dom';

import { withApiData } from '../../with-api-data';

import Chevron from './Chevron';

const internalLink = link => link.replace( window.H2Data.site.home, '' );

const Category = ( { all, category } ) => {
	const childCategories = all.filter( cat => cat.parent === category.id );

	return (
		<li>
			<Link
				exact
				activeClassName="is-active"
				className="Sidebar-link"
				to={ internalLink( category.link ) }
			>
				<span>
					{ category.name }

					{ Object.prototype.hasOwnProperty.call( category, 'count' ) && (
						<span className="ml-1 opacity-60">
							({ category.count })
						</span>
					) }
				</span>
				<Chevron />
			</Link>

			{ childCategories && childCategories.length > 0 && (
				<CategoryList
					all={ all }
					categories={ childCategories }
				/>
			) }
		</li>
	);
};

const CategoryList = ( { all, categories } ) => (
	<ul className="Sidebar-navigation Sidebar-navigation-tree">
		{ categories && categories.map( category => (
			<Category
				key={ category.id }
				all={ all }
				category={ category }
			/>
		) ) }
	</ul>
);

export function Categories( props ) {
	return (
		<div className="Sidebar-inline-content">
			<CategoryList
				all={ props.categories.data }
				categories={ props.categories.data ? props.categories.data.filter( cat => cat.parent === 0 ) : [] }
			/>
		</div>
	);
}
export default withApiData( () => ( {
	categories: '/wp/v2/categories?per_page=100&hide_empty=true&_fields=id,count,link,name,slug,parent',
} ) )( Categories );
