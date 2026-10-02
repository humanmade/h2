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

const author = ( site, data = user ) => ( {
	id: data.id,
	name: data.name,
	slug: data.slug,
	link: `${ site.url }/author/${ data.slug }/`,
	avatar_urls: data.avatar_urls,
} );

const results = [
	{
		type: 'post',
		site: sites[1],
		score: 4.2,
		highlight: {
			title: [ 'Deploy <mark>checklist</mark>' ],
			content: [
				'Run through the <mark>checklist</mark> before pushing the button. If anything on the <mark>checklist</mark> fails, stop',
			],
		},
		result: {
			id: 123,
			date: '2026-09-01T10:00:00',
			date_gmt: '2026-09-01T09:00:00',
			link: 'https://example.com/eng/2026/09/01/deploy-checklist/',
			title: {
				rendered: 'Deploy checklist',
			},
			excerpt: {
				rendered: '<p>Before every deploy, run through the checklist.</p>',
			},
			author: user.id,
			_embedded: {
				author: [ author( sites[1] ) ],
			},
		},
	},
	{
		type: 'comment',
		site: sites[0],
		score: 2.1,
		highlight: {
			content: [ 'Have we added the new service to the <mark>checklist</mark> yet?' ],
		},
		result: {
			id: 456,
			post: 1,
			author: users[1].id,
			author_name: users[1].name,
			date: '2026-08-30T15:20:00',
			date_gmt: '2026-08-30T14:20:00',
			content: {
				rendered: '<p>Have we added the new service to the checklist yet?</p>',
			},
			link: 'http://example.com/2018/01/01/tecum-optime/#comment-456',
			author_avatar_urls: users[1].avatar_urls,
			_embedded: {
				author: [ author( sites[0], users[1] ) ],
				up: [
					{
						id: 1,
						link: 'http://example.com/2018/01/01/tecum-optime/',
						title: {
							rendered: 'Tecum optime, deinde etiam cum mediocri amico.',
						},
					},
				],
			},
		},
	},
	{
		type: 'post',
		site: sites[3],
		score: 1.4,
		highlight: {},
		result: {
			id: 789,
			date: '2026-07-12T09:00:00',
			date_gmt: '2026-07-12T08:00:00',
			link: 'https://example.com/design/2026/07/12/component-review-checklist/',
			title: {
				rendered: 'Component review checklist',
			},
			excerpt: {
				rendered: '<p>Everything a component needs before it ships in the design system.</p>',
			},
			author: user.id,
			_embedded: {
				author: [ author( sites[3] ) ],
			},
		},
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
