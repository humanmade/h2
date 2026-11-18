import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Slot } from 'react-slot-fill';

import { hideSidebar, showSidebarCategories, showSidebarPages, showSidebarPosts } from '../actions';
import { withWidgets } from '../hocs';

import Categories from './Sidebar/Categories';
import NavigationButton from './Sidebar/NavigationButton';
import NotificationSettings from './Sidebar/NotificationSettings';
import Pages from './Sidebar/Pages';
import Posts from './Sidebar/Posts';
import SiteDescription from './Sidebar/SiteDescription';
import SiteHeader from './Sidebar/SiteHeader';
import RecentPostsWidget from './Widgets/RecentPosts';
import SearchWidget from './Widgets/Search';

import './Sidebar.css';

function WidgetDisclosure( { children, id, title } ) {
	const storageKey = `h2:sidebar:${ window.H2Data.site.home }:${ id }:open`;
	const [ open, setOpen ] = useState( () => {
		try {
			return window.localStorage.getItem( storageKey ) === 'true';
		} catch ( error ) {
			// Browser storage is optional.
			return false;
		}
	} );

	const onToggle = event => {
		const nextOpen = event.currentTarget.open;
		if ( nextOpen === open ) {
			return;
		}
		setOpen( nextOpen );
		try {
			window.localStorage.setItem( storageKey, String( nextOpen ) );
		} catch ( error ) {
			// The disclosure still works for this visit.
		}
	};

	return (
		<details className="Sidebar-widget-disclosure" open={ open } onToggle={ onToggle }>
			<summary>{ title }</summary>
			{ children }
		</details>
	);
}

function HtmlWidget( { html, id } ) {
	const content = useMemo( () => {
		const template = document.createElement( 'template' );
		template.innerHTML = html || '';

		for ( const link of template.content.querySelectorAll( 'a[href]' ) ) {
			let url;
			try {
				url = new URL( link.getAttribute( 'href' ), document.baseURI );
			} catch ( error ) {
				continue;
			}
			if ( ( url.protocol === 'http:' || url.protocol === 'https:' ) && url.origin !== window.location.origin ) {
				link.setAttribute( 'data-sidebar-external', '' );
			}
		}

		// H2's classic widget wrapper emits a leading h4.widgettitle. Only
		// promote plain titles so block markup and attributed headings stay intact.
		const heading = template.content.firstElementChild;
		const title = heading && heading.matches( 'h4.widgettitle' ) && heading.attributes.length === 1 &&
			heading.childElementCount === 0 && heading.textContent.trim();
		if ( title ) {
			heading.remove();
		}
		return {
			html: template.innerHTML,
			title,
		};
	}, [ html ] );

	const widget = <div className="Widget" dangerouslySetInnerHTML={ { __html: content.html } } />;
	return content.title ? <WidgetDisclosure id={ id } title={ content.title }>{ widget }</WidgetDisclosure> : widget;
}

function RecentPostsDisclosure( { id, title, ...props } ) {
	return (
		<WidgetDisclosure id={ id } title={ title || 'Recent Posts' }>
			<RecentPostsWidget { ...props } />
		</WidgetDisclosure>
	);
}

const widgetMap = new Map( [
	[ 'recent-posts', RecentPostsDisclosure ],
	[ 'search', SearchWidget ],
] );

const navigation = {
	categories: {
		title: 'Categories',
		Component: Categories,
		action: showSidebarCategories,
	},
	posts: {
		title: 'Posts',
		Component: Posts,
		action: showSidebarPosts,
	},
	pages: {
		title: 'Pages',
		Component: Pages,
		action: showSidebarPages,
	},
};

const NavLink = ( { children, className, icon, internal = true, to } ) => {
	const Linker = internal ? Link : 'a';
	const hrefProps = internal ? { to } : { href: to };
	return (
		<li className={ className }>
			<Linker
				className={ [
					'group grid items-baseline px-6 py-2 text-sm hover:bg-hm-beige/20 hover:no-underline!',
					icon ? 'grid-cols-[max-content_auto_min-content]' : 'grid-cols-[auto_min-content]',
				].join( ' ' ) }
				{ ...hrefProps }
			>
				{ icon && (
					<i className={ `icon ${ icon } size-4! self-center mr-2` } />
				) }
				{ children }
				<span className="transition-transform group-hover:translate-x-2">
					&rarr;
				</span>
			</Linker>
		</li>
	);
};
const NavButton = ( { children, onClick, section } ) => {
	return (
		<li>
			<button
				className="w-full text-left cursor-pointer group grid items-baseline grid-cols-[auto_min-content] px-6 py-2 text-sm hover:bg-hm-beige/20 hover:no-underline!"
				data-sidebar-section={ section }
				onClick={ onClick }
				type="button"
			>
				{ children }
				<span className="transition-transform group-hover:translate-x-2">
					&hellip;
				</span>
			</button>
		</li>
	);
};

export function Sidebar( props ) {
	const { dispatch, view, widgets } = props;
	const site = window.H2Data.site;

	const menu = useRef( null );
	const focusNext = useRef( null );
	const section = navigation[ view ];
	const Section = section && section.Component;

	useLayoutEffect( () => {
		if ( focusNext.current ) {
			const target = menu.current.querySelector( focusNext.current );
			focusNext.current = null;
			if ( target ) {
				target.focus();
			}
		}
	}, [ view ] );

	return (
		<aside
			className="Sidebar border-r border-solid border-hm-beige"
		>
			<div className="">
				<SiteHeader>
					{ window.H2Data.has && window.H2Data.has.notifications && (
						<NotificationSettings />
					) }
				</SiteHeader>
				<SiteDescription />
			</div>

			<Slot name="Sidebar.top" />

			<nav aria-label="Site navigation" ref={ menu }>
				<ul className="border-b border-b-hm-beige/50 divide-y divide-hm-beige/50 mb-6">
					<NavLink icon="icon--plus-alt" to="/write">
						New Post
					</NavLink>
					{ section ? (
						<li>
							<div className="px-4 py-2 bg-hm-beige/50 flex items-center gap-2">
								<NavigationButton
									data-sidebar-back
									onClick={ () => {
										focusNext.current = `[data-sidebar-section="${ view }"]`;
										dispatch( hideSidebar() );
									} }
								>
									Back to site navigation
								</NavigationButton>
								<h2 className="font-bold">{ section.title }</h2>
							</div>
							<Section />
						</li>
					) : Object.entries( navigation ).map( ( [ key, item ] ) => (
						<NavButton
							key={ key }
							section={ key }
							onClick={ () => {
								focusNext.current = '[data-sidebar-back]';
								dispatch( item.action() );
							} }
						>
							{ item.title }
						</NavButton>
					) ) }
					<NavLink className="Sidebar-dashboard" internal={ false } to={ site.admin_url }>
						Dashboard
					</NavLink>
				</ul>
			</nav>

			<div className="Sidebar-widgets h2-legacy-prose px-4 divide-hm-beige">
				{ ( widgets.data || [] ).map( widget => {
					const Widget = widgetMap.get( widget.type ) || HtmlWidget;
					return (
						<Widget key={ widget.id } { ...widget } />
					);
				} ) }
			</div>

			<Slot name="Sidebar.bottom" />
		</aside>
	);
}

export default withWidgets( connect( state => ( { view: state.ui.sidebarView } ) )( Sidebar ) );
