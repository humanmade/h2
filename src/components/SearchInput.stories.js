import React from 'react';
import { action } from 'storybook/actions';

import { withCentering } from '../stories/decorators';

import { NetworkSearchInput } from './Super/SearchInput';

export default {
	title: 'Interface/Search',
	decorators: [ withCentering( { width: '50vw' } ) ],
};

export const Input = () => <NetworkSearchInput siteScoped value="" onChange={ action( 'search' ) } />;
export const NetworkInput = () => <NetworkSearchInput value="" onChange={ action( 'search' ) } />;
