import React from 'react';

import Logo from './Header/Logo';
import Link from './RelativeLink';
import SearchInput from './SearchInput';
import { withApiData } from '../with-api-data';

import './SuperMenu.css';

const Category = ( { all, category }) => {
	const childCategories = all.filter( cat => cat.parent === category.id );

	return (
		<li key={ category.id }>
			<Link to={ category.link }>
				{ category.name }
			</Link>

			{ childCategories && (
				<CategoryList
					all={ all }
					categories={ childCategories }
				/>
			) }
		</li>
	);
};

const CategoryList = ( { all, categories } ) => (
	<ul>
		{ categories && categories.map( category => (
			<Category
				key={ category.id }
				all={ all }
				category={ category }
			/>
		) ) }
	</ul>
);

class SuperMenu extends React.Component {
	render() {
		const { categories, visible } = this.props;
		const sites = this.props.sites && this.props.sites.data;

		const classes = [
			'SuperMenu',
			visible && 'SuperMenu--visible',
		];

		return (
			<nav className={ classes.filter( Boolean ).join( ' ' ) }>
				<header>
					<Logo />
					<button
						className="SuperMenu--closer"
						type="button"
						onClick={ this.props.onClose }
					>
						<i className="icon icon--close icon--white" />
					</button>
				</header>

				<div className="SuperMenu__content">
					<SearchInput
						onSearch={ this.props.onSearch }
					/>

					<h2 className="screen-reader-text">Navigation</h2>
					<ul>
						<li><Link to="/">All Posts</Link></li>
						<li><a href="/wp-admin/">Dashboard</a></li>
					</ul>

					{ categories.data && (
						<React.Fragment>
							<h3>Categories</h3>
							<CategoryList
								all={ categories.data }
								categories={ categories.data.filter( cat => cat.parent === 0 ) }
							/>
						</React.Fragment>
					) }

					{ sites ? (
						<React.Fragment>
							<h3>Sites</h3>
							<ul>
								{ sites.map( site => (
									<li key={ site.id }>
										<a href={ site.url }>
											{ site.name }
										</a>
									</li>
								) ) }
							</ul>
						</React.Fragment>
					) : null }
				</div>
			</nav>
		);
	}
}

export default withApiData( props => ( {
	sites: '/h2/v1/site-switcher/sites',
	user: '/wp/v2/users/me',
	categories: '/wp/v2/categories?per_page=100',
} ) )( SuperMenu );
