import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Slot } from 'react-slot-fill';

import { hideSidebar, showSidebarCategories, showSidebarPages, showSidebarPosts } from '../actions';
import { withWidgets } from '../hocs';
import { decodeEntities } from '../util';

import './Sidebar.css';

import Categories from './Sidebar/Categories';
import Chevron from './Sidebar/Chevron';
import NotificationSettings from './Sidebar/NotificationSettings';
import Pages from './Sidebar/Pages';
import Posts from './Sidebar/Posts';
import SiteHeader from './Sidebar/SiteHeader';
import RecentPostsWidget from './Widgets/RecentPosts';
import SearchWidget from './Widgets/Search';

function HtmlWidget( { html, type } ) {
	const content = useMemo( () => {
		const container = document.createElement( 'div' );
		container.innerHTML = html || '';
		container.querySelectorAll( 'a[href]' ).forEach( link => {
			if ( [ 'http:', 'https:' ].includes( link.protocol ) && link.origin !== window.location.origin ) {
				link.dataset.sidebarExternal = 'true';
			}
		} );
		return container.innerHTML;
	}, [ html ] );
	return (
		<div
			className={ `Widget Widget--${ type }` }
			dangerouslySetInnerHTML={ { __html: content } }
		/>
	);
}

const widgetMap = {
	default: HtmlWidget,
	'recent-posts': RecentPostsWidget,
	search: SearchWidget,
};

const NavLink = ( { children, primary = false, to } ) => (
	<RouterNavLink
		exact
		activeClassName="is-active"
		className={ `Sidebar-link${ primary ? ' Sidebar-link--primary' : '' }` }
		to={ to }
	>
		{ primary && (
			<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
				<path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.5" />
			</svg>
		) }
		<span>{ children }</span>
	</RouterNavLink>
);

const navigationViews = {
	categories: {
		title: 'Categories',
		Component: Categories,
		action: showSidebarCategories,
	},
	posts: {
		title: 'Post archive',
		Component: Posts,
		action: showSidebarPosts,
	},
	pages: {
		title: 'Pages',
		Component: Pages,
		action: showSidebarPages,
	},
};

function Navigation( { onChange, siteName, view } ) {
	const selected = navigationViews[ view ];
	const Component = selected && selected.Component;
	return (
		<nav aria-label={ siteName }>
			{ selected ? (
				<>
					<div className="Sidebar-navigation-header">
						<button className="Sidebar-back" type="button" aria-label="Back to site navigation" onClick={ () => onChange( null ) }>
							<Chevron direction="left" />
							Back
						</button>
						<h3 className="Sidebar-browser-title">{ selected.title }</h3>
					</div>
					<Component />
				</>
			) : (
				<ul className="Sidebar-navigation">
					<li className="Sidebar-post-navigation">
						<NavLink to="/">All posts</NavLink>
						<NavLink primary to="/write">New Post</NavLink>
					</li>
					{ Object.entries( navigationViews ).map( ( [ id, item ] ) => (
						<li key={ id }>
							<button className="Sidebar-link" type="button" data-view={ id } onClick={ () => onChange( id ) }>
								<span>{ item.title }</span>
								<Chevron />
							</button>
						</li>
					) ) }
				</ul>
			) }
		</nav>
	);
}

function WidgetSection( { children, id, title } ) {
	const storageKey = `h2:sidebar:${ window.H2Data.site.home }:${ id }:open`;
	const [ open, setOpen ] = useState( () => {
		try {
			return window.localStorage.getItem( storageKey ) === 'true';
		} catch ( error ) {
			// Widgets remain usable when browser storage is unavailable.
			return false;
		}
	} );

	const onToggle = event => {
		const nextOpen = event.currentTarget.open;
		setOpen( nextOpen );
		try {
			window.localStorage.setItem( storageKey, String( nextOpen ) );
		} catch ( error ) {
			// Keep the current page state even if the preference cannot be saved.
		}
	};

	return (
		<details className="Sidebar-section" open={ open } onToggle={ onToggle }>
			<summary>{ decodeEntities( title ) }</summary>
			<div className="Sidebar-section-content">{ children }</div>
		</details>
	);
}

export function Sidebar( props ) {
	const { dispatch, view, widgets } = props;
	const site = window.H2Data.site;

	return (
		<aside className="Sidebar" aria-label="Site navigation" tabIndex={ -1 }>
			<header className="Sidebar-site">
				<SiteHeader>
					{ window.H2Data.has && window.H2Data.has.notifications && <NotificationSettings /> }
				</SiteHeader>
				{ site.description && <p>{ site.description }</p> }
			</header>

			<div className="Sidebar-content" id="site-sidebar-content">
				<Slot name="Sidebar.top" />

				<Navigation
					siteName={ site.name }
					view={ view }
					onChange={ id => dispatch( id ? navigationViews[id].action() : hideSidebar() ) }
				/>

				<div className="Sidebar-widgets h2-legacy-prose">
					{ ( widgets.data || [] ).map( widget => {
						const Widget = widgetMap[ widget.type ] || widgetMap['default'];
						const title = widget.title || ( widget.type === 'recent-posts' ? 'Recent Posts' : null );
						// Untitled custom widgets keep their original markup and controls.
						if ( ! title || widget.type === 'search' ) {
							return <Widget key={ widget.id } { ...widget } />;
						}
						return (
							<WidgetSection key={ widget.id } id={ widget.id } title={ title }>
								<Widget { ...widget } />
							</WidgetSection>
						);
					} ) }
				</div>

				<Slot name="Sidebar.bottom" />

			</div>
		</aside>
	);
}

export default withWidgets( connect( state => ( { view: state.ui.sidebarView } ) )( Sidebar ) );
