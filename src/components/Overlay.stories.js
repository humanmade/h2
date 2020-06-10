import { action } from '@storybook/addon-actions';
import React, { Fragment } from 'react';

import Overlay, { OverlayContainer } from './Overlay';

export default {
	title: 'Components|Overlay',
};

export const Basic = () => (
	<Fragment>
		<OverlayContainer />
		<Overlay
			onClick={ action( 'onClick' ) }
		/>
	</Fragment>
);
