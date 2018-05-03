import React from 'react';

import Logo from './Header/Logo';
import Link from './RelativeLink';
import { withApiData } from '../with-api-data';

import './SuperMenu.css';

const sites = [
	{
		url: 'https://updates.hmn.md/',
		title: 'Updates',
	},
	{
		url: 'https://dev.hmn.md/',
		title: 'Dev',
	},
	{
		url: 'https://servers.hmn.md/',
		title: 'Servers',
	},
	{
		url: 'https://money.hmn.md/',
		title: 'Money',
	},
	{
		url: 'https://hiring.hmn.md/',
		title: 'Hiring',
	},
	{
		url: 'https://pm.hmn.md/',
		title: 'Project Management',
	},
];

class SuperMenu extends React.Component {
	render() {
		const { categories, visible } = this.props;

		const classes = [
			'SuperMenu',
			visible && 'SuperMenu--visible',
		];

		return <nav className={ classes.filter( Boolean ).join( ' ' ) }>
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

			<h2 className="screen-reader-text">Navigation</h2>
			<ul>
				<li><Link to="/">All Posts</Link></li>
				{/*<li><Link to="/drafts/">Your Drafts</Link></li>*/}
			</ul>

			<h3>Categories</h3>
			<ul>
				{ categories.data && categories.data.map( category => (
					<li key={ category.id }>
						<Link to={ category.link }>
							{ category.name }
						</Link>
					</li>
				) ) }
			</ul>

			<h3>Sites</h3>
			<ul>
				{ sites.map( site => (
					<li key={ site.url }>
						<a href={ site.url }>
							{ site.title }
						</a>
					</li>
				) ) }
			</ul>
		</nav>;
	}
}

export default withApiData( props => ( {
	user:       '/wp/v2/users/me',
	categories: '/wp/v2/categories',
} ) )( SuperMenu );
