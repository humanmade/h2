import React from 'react';
import { connect } from 'react-redux';

import { withCentering, withStore } from '../stories/decorators';
import { apiResponse } from '../stories/util';

import { Sidebar } from './Sidebar';

const ConnectedSidebar = connect( state => ( { view: state.ui.sidebarView } ) )( Sidebar );

export default {
	title: 'Interface|Sidebar',
	decorators: [
		withStore(),
		withCentering( { width: '30vw' } ),
	],
};

const commonProps = {
	widgets: { data: [] },
};

const htmlWidget = {
	type: 'html',
	html: '<p>Raw HTML widget.</p>',
};

export const Empty = () => (
	<ConnectedSidebar
		{ ...commonProps }
	/>
);

export const Basic = () => (
	<ConnectedSidebar
		widgets={ apiResponse( [ htmlWidget ] ) }
	/>
);

export const WithSections = () => (
	<ConnectedSidebar
		widgets={ apiResponse( [
			{
				id: 'nav_menu-2',
				type: 'nav_menu',
				title: 'Useful Links',
				html: '<h4 class="widgettitle">Useful Links</h4><ul><li><a href="/handbook">Company Handbook</a></li><li><a href="/calendar">Team Calendar</a></li></ul>',
			},
			{
				id: 'categories-2',
				type: 'categories',
				title: 'Categories',
				html: '<h4 class="widgettitle">Categories</h4><ul><li><a href="/category/announcements">Announcements</a><ul><li><a href="/category/introductions">Introductions</a></li></ul></li><li><a href="/category/projects">Projects and longer category names that wrap</a></li></ul>',
			},
		] ) }
	/>
);

// Keep prose, ordered-list numbering and nested disclosures intact inside a widget.
export const RichTextWidget = () => (
	<ConnectedSidebar
		widgets={ apiResponse( [ {
			id: 'text-regression',
			type: 'text',
			title: 'Rich text regression',
			html: '<h4 class="widgettitle">Rich text regression</h4><p>An <a href="/handbook">inline link</a> stays within its sentence.</p><ol start="3"><li>First required step</li><li>Second required step</li></ol><details><summary>Nested details</summary><p>Nested content</p></details>',
		} ] ) }
	/>
);
