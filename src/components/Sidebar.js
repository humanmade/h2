import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Slot } from 'react-slot-fill';

import { showSidebarCategories, showSidebarPages, showSidebarPosts } from '../actions';
import { withWidgets } from '../hocs';

import NotificationSettings from './Sidebar/NotificationSettings';
import SiteHeader from './Sidebar/SiteHeader';
import RecentPostsWidget from './Widgets/RecentPosts';
import SearchWidget from './Widgets/Search';

import './Sidebar.css';

const widgetMap = {
	default: ( { html } ) => (
		<div
			className="Widget"
			dangerouslySetInnerHTML={ { __html: html } }
		/>
	),
	'recent-posts': RecentPostsWidget,
	search: SearchWidget,
};

const NavLink = ( { children, icon, internal = true, to } ) => {
	const Linker = internal ? Link : 'a';
	const hrefProps = internal ? { to } : { href: to };
	return (
		<li>
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
const NavButton = ( { children, icon, internal = true, onClick } ) => {
	return (
		<li>
			<button
				className={ [
					'w-full text-left cursor-pointer group grid items-baseline px-6 py-2 text-sm hover:bg-hm-beige/20 hover:no-underline!',
					icon ? 'grid-cols-[max-content_auto_min-content]' : 'grid-cols-[auto_min-content]',
				].join( ' ' ) }
				onClick={ onClick }
			>
				{ icon && (
					<i className={ `icon ${ icon } size-4! self-center mr-2` } />
				) }
				{ children }
				<span className="transition-transform group-hover:translate-x-2">
					&hellip;
				</span>
			</button>
		</li>
	);
};

export function Sidebar( props ) {
	const { dispatch, widgets } = props;
	const site = window.H2Data.site;

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
				<div className="px-4 py-4 bg-hm-beige/50">
					<p className="text-sm opacity-60 m-0">{ site.description || 'No description yet.' }</p>
				</div>
			</div>

			<Slot name="Sidebar.top" />

			<ul className="border-b border-b-hm-beige/50 divide-y divide-hm-beige/50 mb-6">
				<NavLink
					icon="icon--plus-alt"
					to="/write"
				>
					New Post
				</NavLink>
				<NavButton
					onClick={ () => dispatch( showSidebarCategories() ) }
				>
					Categories
				</NavButton>
				<NavButton
					onClick={ () => dispatch( showSidebarPosts() ) }
				>
					Posts
				</NavButton>
				<NavButton
					onClick={ () => dispatch( showSidebarPages() ) }
				>
					Pages
				</NavButton>
				<NavLink
					internal={ false }
					to={ `${ site.home }/wp-admin/` }
				>
					Dashboard
				</NavLink>
			</ul>

			<div className="Sidebar-widgets h2-legacy-prose px-4 divide-hm-beige">
				{ ( widgets.data || [] ).map( widget => {
					const Widget = widgetMap[ widget.type ] || widgetMap['default'];
					return (
						<Widget key={ widget.id } { ...widget } />
					);
				} ) }
			</div>

			<Slot name="Sidebar.bottom" />
		</aside>
	);
}

export default withWidgets( connect()( Sidebar ) );
