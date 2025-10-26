import React from 'react';

import { getChangesForUser } from '../changelog';
import { withCategories, withCurrentUser, withSites } from '../hocs';

import HeaderLabel from './Header/HeaderLabel';
import Logo from './Header/Logo';
import Link from './Link';
import Overlay from './Overlay';
import SearchInput from './SearchInput';

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
	<ul className="list-none p-0 m-0 mb-6 [&_ul]:ml-4 [&_ul]:mb-0">
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
			'bg-hm-light-grey absolute w-[300px] h-screen overflow-auto z-30 p-4 px-5 shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-transform duration-150 flex flex-col',
			visible ? 'SuperMenu--visible translate-x-0' : '-translate-x-[300px]',
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

				<header className="-mx-5 -mt-4 mb-4 flex-shrink-0 flex items-center justify-between bg-brand pr-4 text-white [&_.hm-logo:hover]:opacity-100">
					<Logo />
					<button
						className="SuperMenu--closer bg-transparent border-none p-0 m-0 cursor-pointer"
						type="button"
						onClick={ this.props.onClose }
					>
						<i className="icon icon--close icon--white" />
					</button>
				</header>

				<div className="SuperMenu__content overflow-auto [&_a]:text-black [&_a:link]:text-black [&_a:visited]:text-black">
					<SearchInput
						className="mb-4 min-[600px]:hidden"
						small
						onSearch={ this.props.onSearch }
					/>

					<h2 className="screen-reader-text text-base m-0 mb-4">Navigation</h2>

					<ul className="list-none p-0 mb-6">
						<li><Link href={ window.H2Data.site.home }>All Posts</Link></li>
						<li><a href={ `${ window.H2Data.site.home }/wp-admin/` }>Dashboard</a></li>
					</ul>

					<HeaderLabel
						className="Header-changelog"
						icon="mail"
						title={ newLabel }
						onClick={ this.props.onShowChanges }
					/>

					{ categories.data && (
						<React.Fragment>
							<h3 className="text-hm-warm-grey uppercase text-base mt-3 mb-1">Categories</h3>
							<CategoryList
								all={ categories.data }
								categories={ categories.data.filter( cat => cat.parent === 0 ) }
							/>
						</React.Fragment>
					) }

					{ sites ? (
						<React.Fragment>
							<h3 className="text-hm-warm-grey uppercase text-base mt-3 mb-1">Sites</h3>
							<ul className="list-none p-0 m-0 mb-6">
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
