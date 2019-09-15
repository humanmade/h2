import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import SearchInput, { Results } from './SearchInput';
import { withCentering, withStore } from '../stories/decorators';
import { post } from '../stories/stubs';

storiesOf( 'Components/Search', module )
	.addDecorator( withStore( {} ) )
	.addDecorator( withCentering( { width: '50vw' } ) )
	.add( 'Input', () => {
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
	} )
	.add( 'Input (Showing Results)', () => {
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
	} )
	.add( 'Input (Loading)', () => {
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
	} )
	.add( 'Results', () => (
		<Results
			loading={ false }
			posts={ [ post ] }
			term="lorem"
			visible
		/>
	) );