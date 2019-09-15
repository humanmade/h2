import { action } from '@storybook/addon-actions';
import React, { Fragment } from 'react';

import Overlay, { OverlayContainer } from './Overlay';
import { withCentering } from '../stories/decorators';

export default {
	title: 'Components|Overlay',
	decorators: [
		withCentering(),
	],
}

export const Basic = () => (
	<Fragment>
		<OverlayContainer />
		<Overlay
			onClick={ action( 'onClick' ) }
		/>
	</Fragment>
);
