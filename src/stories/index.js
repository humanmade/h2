import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { htmlTester, post } from './stubs';
import { withCentering, withPadding, withStore } from './decorators';
import Avatar from '../components/Avatar';
import { Content } from '../components/Message/Content';
import SearchInput, { Results } from '../components/SearchInput';

import '../hm-pattern-library/assets/styles/juniper.css';

storiesOf( 'Base Styles' )
	.addDecorator( withPadding() )
	.add( 'Elements', () => (
		<div
			dangerouslySetInnerHTML={ { __html: htmlTester } }
		/>
	) )
	.add( 'Content', () => (
		<Content
			html={ htmlTester }
		/>
	) );

storiesOf( 'Components', module )
	.addDecorator( withStore( {} ) )
	.addDecorator( withCentering() )
	.add( 'Avatar', () => (
		<Avatar
			size={ 32 }
			url="https://secure.gravatar.com/avatar/0ceb885cc3d306af93c9764b2936d618?s=300&d=mm&r=g"
		/>
	) );

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
