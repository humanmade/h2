import React from 'react';
import { Link } from 'react-router-dom';

import { withCategories } from '../../hocs';

import Container from './Container';

const internalLink = link => link.replace( window.H2Data.site.home, '' );

const Category = ( { all, category } ) => {
	const childCategories = all.filter( cat => cat.parent === category.id );

	return (
		<li>
			<Link
				className="group grid grid-cols-[auto_min-content] -ml-4 px-4 py-2 text-sm hover:bg-hm-beige/20 hover:no-underline!"
				to={ internalLink( category.link ) }
			>
				<span>
					{ category.name }

					{ category.hasOwnProperty( 'count' ) && (
						<span className="ml-1 opacity-60">
							({ category.count })
						</span>
					) }
				</span>
				<span className="transition-transform group-hover:translate-x-2">
					&rarr;
				</span>
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
	<ul className={ `my-0 border-t border-hm-beige/50 divide-y divide-hm-beige/50 pl-4` }>
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
		<Container
			title="Categories"
			onClose={ props.onClose }
		>
			<div className="-mx-6 -mt-4">
				<CategoryList
					all={ props.categories.data }
					categories={ props.categories.data ? props.categories.data.filter( cat => cat.parent === 0 ) : [] }
				/>
			</div>
		</Container>
	);
}
export default withCategories( Categories );
