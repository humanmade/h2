import React from 'react';

import { getChangesForUser } from '../changelog';
import { withCategories, withCurrentUser, withSites } from '../hocs';

import HeaderLabel from './Header/HeaderLabel';
import Logo from './Header/Logo';
import Link from './Link';
import Overlay from './Overlay';
import SearchInput from './SearchInput';

import './SuperMenu.css';

const Category = ( { all, category } ) => {
	const childCategories = all.filter( cat => cat.parent === category.id );

	return (
		<li key={ category.id }>
			<Link href={ category.link }>
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

export class SuperMenu extends React.Component {
	render() {
		const { categories, visible } = this.props;
		const sites = this.props.sites && this.props.sites.data;

		const classes = [
			'SuperMenu',
			visible && 'SuperMenu--visible',
		];

		const newChanges = this.props.currentUser ? getChangesForUser( this.props.currentUser ) : [];

		const newLabel = (
			<span>
				What's New?
				{ ' ' }
				{ newChanges.length > 0 ? <span className="label__count">{ newChanges.length }</span> : null }
			</span>
		);

		return (
			<nav className={ classes.filter( Boolean ).join( ' ' ) }>
				{ visible && (
					<Overlay
						onClick={ this.props.onClose }
					/>
				) }

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

					<HeaderLabel
						className="Header-changelog"
						icon="mail"
						title={ newLabel }
						onClick={ this.props.onShowChanges }
					/>

					<ul>
						<li><Link href={ window.H2Data.site.home }>All Posts</Link></li>
						<li><a href={ `${ window.H2Data.site.home }/wp-admin/` }>Dashboard</a></li>
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

export default withSites( withCategories( withCurrentUser( SuperMenu ) ) );
