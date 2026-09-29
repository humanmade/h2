import { action } from '@storybook/addon-actions';
import React from 'react';

import { withPadding, withStore } from '../../stories/decorators';
import { user, users } from '../../stories/stubs';

import { SearchView } from './Search';
import { SiteSwitcher } from './SiteSwitcher';

export default {
	title: 'Interface|Super Overlay',
	decorators: [
		withStore(),
		withPadding(),
	],
};

const sites = [
	{
		id: 1,
		name: 'Storybook Site',
		description: 'The site you are currently viewing.',
		url: 'http://example.com',
	},
	{
		id: 2,
		name: 'Engineering',
		description: 'Technical discussion, incident reports and release notes.',
		url: 'https://example.com/eng',
	},
	{
		id: 3,
		name: 'Updates',
		description: '',
		url: 'https://updates.example.com',
	},
	{
		id: 4,
		name: 'Design',
		description: 'Critique, research and the design system.',
		url: 'https://example.com/design',
	},
];

const author = site => ( {
	id: user.id,
	name: user.name,
	slug: user.slug,
	link: `${ site.url }/author/${ user.slug }/`,
	avatar_urls: user.avatar_urls,
} );

const results = [
	{
		id: 123,
		type: 'post',
		site: sites[1],
		title: 'Deploy checklist',
		excerpt: '<p>Before every deploy, run through the checklist.</p>',
		link: 'https://example.com/eng/2026/09/01/deploy-checklist/',
		date: '2026-09-01T10:00:00',
		date_gmt: '2026-09-01T09:00:00',
		author: author( sites[1] ),
		score: 4.2,
		highlight: {
			title: [ 'Deploy <mark>checklist</mark>' ],
			content: [
				'Run through the <mark>checklist</mark> before pushing the button. If anything on the <mark>checklist</mark> fails, stop',
			],
		},
	},
	{
		id: 456,
		type: 'comment',
		site: sites[0],
		title: 'Tecum optime, deinde etiam cum mediocri amico.',
		excerpt: '<p>Have we added the new service to the checklist yet?</p>',
		link: 'http://example.com/2018/01/01/tecum-optime/#comment-456',
		date: '2026-08-30T15:20:00',
		date_gmt: '2026-08-30T14:20:00',
		author: {
			...author( sites[0] ),
			id: users[1].id,
			name: users[1].name,
			avatar_urls: users[1].avatar_urls,
		},
		post: {
			id: 1,
			title: 'Tecum optime, deinde etiam cum mediocri amico.',
			link: 'http://example.com/2018/01/01/tecum-optime/',
		},
		score: 2.1,
		highlight: {
			content: [ 'Have we added the new service to the <mark>checklist</mark> yet?' ],
		},
	},
	{
		id: 789,
		type: 'post',
		site: sites[3],
		title: 'Component review checklist',
		excerpt: '<p>Everything a component needs before it ships in the design system.</p>',
		link: 'https://example.com/design/2026/07/12/component-review-checklist/',
		date: '2026-07-12T09:00:00',
		date_gmt: '2026-07-12T08:00:00',
		author: author( sites[3] ),
		score: 1.4,
		highlight: {},
	},
];

const searchProps = {
	error: null,
	loading: false,
	orderby: 'relevance',
	page: 1,
	period: 'any',
	results,
	selectedSites: [],
	sites: {
		data: sites,
		isLoading: false,
	},
	term: 'checklist',
	total: 23,
	totalPages: 3,
	type: 'all',
	onChangeOrderby: action( 'onChangeOrderby' ),
	onChangePage: action( 'onChangePage' ),
	onChangePeriod: action( 'onChangePeriod' ),
	onChangeSites: action( 'onChangeSites' ),
	onChangeType: action( 'onChangeType' ),
};

export const Sites = () => (
	<SiteSwitcher
		sites={ {
			data: sites,
			isLoading: false,
		} }
	/>
);

export const SitesLoading = () => (
	<SiteSwitcher
		sites={ {
			data: null,
			isLoading: true,
		} }
	/>
);

export const SearchResults = () => (
	<SearchView
		{ ...searchProps }
	/>
);

export const SearchFiltered = () => (
	<SearchView
		{ ...searchProps }
		orderby="date"
		results={ results.filter( result => result.site.id === 2 ) }
		selectedSites={ [ 2 ] }
		total={ 1 }
		totalPages={ 1 }
		type="post"
	/>
);

export const SearchLoading = () => (
	<SearchView
		{ ...searchProps }
		loading
		results={ null }
		total={ 0 }
		totalPages={ 0 }
	/>
);

export const SearchEmpty = () => (
	<SearchView
		{ ...searchProps }
		results={ [] }
		total={ 0 }
		totalPages={ 0 }
	/>
);

export const SearchError = () => (
	<SearchView
		{ ...searchProps }
		error={ new Error( 'Search is not available on this network.' ) }
		results={ null }
		total={ 0 }
		totalPages={ 0 }
	/>
);
