import { action } from '@storybook/addon-actions';
import React from 'react';

import SearchInput, { Results } from './SearchInput';
import { withCentering, withStore } from '../stories/decorators';
import { post } from '../stories/stubs';

export default {
	title: 'Interface|Search',
	decorators: [
		withStore( {} ),
		withCentering( { width: '50vw' } ),
	],
};

export const Input = () => {
	const ResultsComponent = props => (
		<Results
			{ ...props }
			loading={ false }
			posts={ [ post ] }
		/>
	);
	return (
		<SearchInput
			value="value"
			onSearch={ action( 'onSearch' ) }
			resultsComponent={ ResultsComponent }
		/>
	);
};

export const ShowingResults = () => {
	const ResultsComponent = props => (
		<Results
			{ ...props }
			loading={ false }
			posts={ [ post ] }
			visible
		/>
	);
	return (
		<SearchInput
			value="value"
			onSearch={ action( 'onSearch' ) }
			resultsComponent={ ResultsComponent }
		/>
	);
};

export const Loading = () => {
	const ResultsComponent = props => (
		<Results
			{ ...props }
			loading={ true }
			visible
		/>
	);
	return (
		<SearchInput
			value="value"
			onSearch={ action( 'onSearch' ) }
			resultsComponent={ ResultsComponent }
		/>
	);
};

export const SearchResults = () => (
	<Results
		loading={ false }
		posts={ [ post ] }
		term="lorem"
		visible
	/>
);
