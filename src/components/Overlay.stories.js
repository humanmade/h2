import React, { Fragment } from 'react';
import { action } from 'storybook/actions';

import Overlay, { OverlayContainer } from './Overlay';

export default {
	title: 'Components/Overlay',
};

export const Basic = () => (
	<Fragment>
		<OverlayContainer />
		<Overlay
			onClick={ action( 'onClick' ) }
		/>
	</Fragment>
);
